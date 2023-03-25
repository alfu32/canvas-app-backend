

class FsDb{
    file='db.json';
    indexFile='index.json';
    indexers=[]
    constructor(databaseName){
        this.file=`${databaseName}.json`
        this.index=`${databaseName}.index.json`
    }
    indexBy(name,indexerFunction){
        this.indexers.push({
            name,
            filename:`${name}.index.json`,
            indexerFunction,
        })
    }
    add(ent){
        const dwString=JSON.stringify(ent,null,' ')
        let fdIndex=fs.openSync(this.file)
        const len0=fs.fstatSync(fdIndex).size
        fs.closeSync(fdIndex)
        fs.appendFileSync(this.file,dwString)
        fs.appendFileSync(this.file,"\n")
        fdIndex=fs.openSync(this.file)
        const len1=fs.fstatSync(fdIndex).size
        fs.closeSync(fdIndex)

        const indexData=JSON.stringify({
            id:ent.id,
            len0,
            len1,
        },null,' ')
        fs.appendFileSync(this.indexFile,indexData)
        fs.appendFileSync(this.indexFile,"\n")

    }
    find(ent){
        
    }
    delete(ent){
        
    }
}