

const fs = require( 'fs')
class FsDbIndexer{
    name='index';
    file='index.json';
    index=[]
    indexerFn=(e)=>e.id
    database;
    constructor(name,indexerFn,database){
        this.name=name
        this.file=`${name}.json`
        this.indexerFn=indexerFn;
        this.database=database

        fs.appendFileSync(this.file,"")
        this.load()
        console.log("constructor::index",this.index)
    }
    load(){
        const flc=fs.readFileSync(this.file).toString("utf-8")
        const json=`[${flc+"{}"}]`
        // console.log("loadIndexes.json:"+this.file,json)
        this.index=JSON.parse(json).filter(e => !!e.id && !!e.pos0 && !!e.pos1)
        // console.log("loadedIndexes.index:"+this.file,this.index)
    }

    addToIndex(ent,pos0){
        const dwString=JSON.stringify(ent,null,' ')
        const pos1=pos0+1+dwString.length
        const indexVal={
            id:ent.id,
            value:this.indexerFn(ent),
            pos0,
            pos1,
        }
        this.index.push(indexVal)
        console.log("addToIndex::index",this.index)
        const indexData=JSON.stringify(indexVal,null,' ')
        fs.appendFileSync(this.file,indexData)
        fs.appendFileSync(this.file,",")
    }
    entityReader(fd){
        return(ix) =>{
        const len=ix.pos1-ix.pos0-1
        const buffer = Buffer.alloc(len,0)
        const rd=fs.readSync(fd,buffer,0,len,ix.pos0)
        const json=buffer.toString("utf-8").trim(',')
        // console.log(ix)
        // console.log(json)
        //return json
        return JSON.parse(json)}
    }
    all(e){
        const fd=fs.openSync(this.database.file,"r")
        const re=this.entityReader(fd)
        const r = this.index.map(re)
        fs.closeSync(fd)
        return r
        
    }
    find(e){
        const fd=fs.openSync(this.database.file,"r")
        const re=this.entityReader(fd)
        const r = this.index.filter(ix => ix.value===this.indexerFn(e)).map(re)
        fs.closeSync(fd)
        return r
    }
}
class FsDb{
    databaseName="";
    file='db.json';
    indexers=[]
    defaultIndexer
    constructor(databaseName,defaultIndexer=new FsDbIndexer(`${databaseName}.index.byid`,e=>e.id,this)){
        this.databaseName=databaseName
        this.file=`${databaseName}.json`
        this.indexBy(defaultIndexer)
        this.defaultIndexer=defaultIndexer
        fs.appendFileSync(this.file,"")
    }
    indexBy(indexer){
        indexer.database=this;
        this.indexers.push(indexer)
    }
    add(ent){
        const dwString=JSON.stringify(ent,null,' ')
        let fdIndex=fs.openSync(this.file)
        const pos0=fs.fstatSync(fdIndex).size
        fs.closeSync(fdIndex)
        this.indexers.forEach(indexer => indexer.addToIndex(ent,pos0))
        fs.appendFileSync(this.file,dwString)
        fs.appendFileSync(this.file,",")
    }
    find(ent){
        const fIndexer=this.indexers.find(indexer => {
            let val = indexer.indexerFn(ent)
            return val !== null && !isNaN(val) && typeof(val)!=="undefined" && typeof(val)!=="function"
        })||this.defaultIndexer
        return this.findUsingIndexer(ent,fIndexer)
    }
    findUsingIndexer(ent,indexer=this.defaultIndexer){
        return indexer.find(ent)
    }
    all(){
        // console.log("all",this.indexes)
        return this.defaultIndexer.all()
    }
    remove(ent){
        return ent
    }
}

module.exports={FsDbIndexer,FsDb}