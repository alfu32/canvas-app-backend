/**
 * @typedef Entity
 * 
 */
class Entity{
    /**
     * @field {string} id
     */
    id;
    /**
     * {[key: string]: any} rest
     */
}

const fs = require( 'fs')
/**
 * @typedef FsDbIndexer
 */
class FsDbIndexer{
    /**
     * @type {string} name
     */
    name='index';
    /**
     * @type {string} file
     */
    file='index.json';
    /**
     * @type {FsDbIndex[]} index
     */
    index=[]
    /**
     * @type {{[key:string]:FsDbIndex[]}} indexByValue
     */
    indexByValue={}
    /**
     * @type {(Entity)=>string[]} indexByValue
     */
    indexerFn=(e)=>[e.id]
    /**
     * @type {FsDb} database
     */
    database;
    /**
     * 
     * @param {string} name base name
     * @param {(Entity)=>string} indexerFn 
     * @param {FsDb} database 
     */
    constructor(name,indexerFn,database){
        this.name=name
        this.file=`${name}.json`
        this.indexerFn=indexerFn;
        this.database=database

        if(!fs.existsSync(this.file)){
            fs.appendFileSync(this.file,"")
        }
        this.load()
        console.log("constructor::index",this.index)
    }
    reindex(){
        if(fs.existsSync(this.file)){
            fs.unlinkSync(this.file)
            fs.appendFileSync(this.file,"")
        }
        const flc=fs.readFileSync(this.database.file).toString("utf-8")
        const json=`[${flc+"null"}]`
        JSON.parse(json)
        .forEach(e => {
            if(e !== null){
                this.addToIndex(e)
            }
        })

    }
    /**
     * load    loads the index file in memory
     */
    load(){
        const flc=fs.readFileSync(this.file).toString("utf-8")
        const json=`[${flc+"null"}]`
        // console.log("loadIndexes.json:"+this.file,json)
        this.index=JSON.parse(json).filter(e => e!==null)
        // console.log("loadedIndexes.index:"+this.file,this.index)
    }
    /**
     * adds entity index to index file
     * @param {Entity} ent entity to be indexed
     * @param {boolean} isRemoved flag indicating the entity is removed
     */
    addToIndex(ent){
        let fdIndex=fs.openSync(this.database.file)
        const pos0=fs.fstatSync(fdIndex).size
            const dwString=JSON.stringify(ent,null,' ')
            const pos1=pos0+1+dwString.length
        fs.closeSync(fdIndex)
        this.indexerFn(ent).forEach(
            value => {
            const indexVal={
                id:ent.id,
                value:value,
                date:Date.now(),
                removed:false,
                pos0,
                pos1,
            }
            this.index.push(indexVal)
            console.log("addToIndex::index",this.index)
            const indexData=JSON.stringify(indexVal,null,' ')
            fs.appendFileSync(this.file,indexData)
            fs.appendFileSync(this.file,",")
        })
    }
    /**
     * @private
     * returns a reader function of the fiel descriptor of the index file
     * !! is not reentrant
     * @param {number} fd file descriptor
     * @returns {Entity}
     */
    entityReader(fd){
        return(ix) =>{
            const len=ix.pos1-ix.pos0-1
            const buffer = Buffer.alloc(len,0)
            const rd=fs.readSync(fd,buffer,0,len,ix.pos0)
            const json=buffer.toString("utf-8").trim(',')
            // console.log(ix)
            // console.log(json)
            //return json
            try{
                return JSON.parse(json);
            }catch(err){
                console.log(`"error parsing json [[${json}]]"`);
                return null
            }
        }
    }
    /**
     * returns all entities in the database
     * @param {Entity} e 
     * @returns {Entity[]}
     */
    all(e){
        const fd=fs.openSync(this.database.file,"r")
        const re=this.entityReader(fd)
        const r = this.index.map(re).filter(v => v !== null)
        fs.closeSync(fd)
        return lastById(r)
        
    }
    /**
     * 
     * @param {Entity} e 
     * @returns {Entity[]}
     */
    find(e){
        return this.findIndexValue(this.indexerFn(e))
    }
    /**
     * 
     * @param {string} lookup index value 
     * @returns {Entity[]}
     */
    findIndexValue(lookup){
        const fd=fs.openSync(this.database.file,"r")
        const re=this.entityReader(fd)
        const r = this.index.filter(ix => lookup.indexOf(ix.value)>-1).map(re)
        fs.closeSync(fd)
        return lastById(r)
    }
}
class FsDb{
    /**
     * @type {string} databaseName
     */
    databaseName="";
    /**
     * @type {string} file
     */
    file='db.json';
    /**
     * @type {FsDbIndexer[]} indexers
     */
    indexers=[]
    /**
     * @type {FsDbIndexer} defaultIndexer
     */
    defaultIndexer
    /**
     * 
     * @param {string} databaseName base name of the database
     * @param {FsDbIndexer} defaultIndexer initialized by default with an indexer by entity id
     */
    constructor(databaseName,defaultIndexer=new FsDbIndexer(`${databaseName}.index.byid`,e=>[e.id],this)){
        this.databaseName=databaseName
        this.file=`${databaseName}.json`
        if(!fs.existsSync()){
            fs.appendFileSync(this.file,"")
        }
        this.indexBy(defaultIndexer)
        this.defaultIndexer=defaultIndexer
    }
    /**
     * add an indexer to the database
     * @param {FsDbIndexer} indexer 
     */
    indexBy(indexer){
        indexer.database=this;
        indexer.reindex()
        this.indexers.push(indexer)
    }
    /**
     * adds an entity to the database
     * @param {Entity} ent entity to be added
     */
    add(ent){
        const dwString=JSON.stringify(ent,null,' ')
        this.indexers.forEach(indexer => indexer.addToIndex(ent))
        fs.appendFileSync(this.file,dwString)
        fs.appendFileSync(this.file,",")
    }
    /**
     * finds all entities matching ent using all indexers
     * @param {Entity} ent entity query
     * @returns {Entity[]}
     */
    find(ent){
        const fIndexer=this.indexers.flatMap(indexer => {
            return this.findUsingIndexer(ent,indexer)
        })
        return lastById(fIndexer)
    }
    /**
     * searches the database for all entities that return the same index as {ent} using {indexer}
     * @param {Entity} ent entity to be matched
     * @param {FsDbIndexer} indexer indexer to be used for search
     * @returns {Entity[]}
     */
    findUsingIndexer(ent,indexer=this.defaultIndexer){
        return (indexer.find(ent))
    }
    findUsingIndexValue(indexValue,indexer=this.defaultIndexer){
        return (indexer.findIndexValue(indexValue))
    }
    /**
     * returns all entities stored in the database
     * @returns {Entity[]}
     */
    all(){
        // console.log("all",this.indexes)
        return this.defaultIndexer.all()
    }
    /**
     * removes an entity
     * @param {Entity} ent entity to be removed
     * @returns {Entity} entity that was removed
     */
    remove(ent){
        return ent
    }
}
function lastById(table){
    Object.values(table.reduce(
        (a,e) => {
            (e&&e.id)?a[e.id]=e:null;
            return a;
        },{}
    ))
}
class StorageAdapter{}
class DiskStorageAdapter extends StorageAdapter{
    /**
     * @type {string}
     */
    filename
    static of(filename){
        const dsa=new DiskStorageAdapter();
        dsa.filename=filename;
    }
    store({record}){
        console.log("TODO:DiskStorageAdapter.store",{record})
    }
    update({record}){
        console.log("TODO:DiskStorageAdapter.update",{record})
    }
    remove({record,before}){
        console.log("TODO:DiskStorageAdapter.remove",{record,before})
    }
    index({indexName,indexValue,record}){
        console.log("TODO:DiskStorageAdapter.index",{indexName,indexValue,record})
    }
    removeFromIndex({record}){
        console.log("TODO:DiskStorageAdapter.removeFromIndex",{record})
    }
}

const {InMemoryNoSQLDatabase}=require("./imdb/InMemoryNoSQLDatabase")
const {Point,Box}=require("./geometry")
class TopologicalDatabase{
    /**
     * @type {InMemoryNoSQLDatabase}
     */
    db
    /**
     * @type {StorageAdapter}
     */
    storage
    /**
     * @type {number}
     */
    boxScale=1000
    /**
     * 
     * @param {string} filename 
     */
    static usingFile(filename){
        const td=new TopologicalDatabase()
        const db=new InMemoryNoSQLDatabase()
        const storageBackend=DiskStorageAdapter.of(filename)
        td.data=storageBackend.getAll()
        db.indexBy("id",e => [e.id])
        db.indexBy("box",e => Box.of(e).getSlices(1000))

        db.on('add',({record})=>storageBackend.store({record}))
        db.on('update',({record})=>storageBackend.update({record}))
        db.on('remove',({record,before})=>storageBackend.remove({record,before}))
        db.on('index',({indexName,indexValue,record})=>storageBackend.index({indexName,indexValue,record}))
        db.on('removeFromIndex',({record})=>storageBackend.removeFromIndex({record}))
        td.db=database;
        td.storage=storageBackend;
    }
    /**
     * 
     * @param {Record} record 
     */
    add(record){
        this.db.add(record)
    }
    /**
     * 
     * @param {Record} record 
     */
    remove(record){
        this.db.remove(record)
    }
    /**
     * 
     * @param {Record} record 
     */
    update(record,fn){
        this.db.update(record,fn)
    }
    /**
     * 
     * @param {Record} record 
     * @returns {Record}
     */
    findById(id){
        return this.db.findByIndex('id',id)
    }
    /**
     * 
     * @param {Box} box 
     * @returns {Record[]}
     */
    findInBox(box){
        return box.getSlices(this.boxScale).flatMap(
            slice => this.db.findByIndex('box',slice.toString())
        )
        
    }
}

module.exports={FsDbIndexer,FsDb}