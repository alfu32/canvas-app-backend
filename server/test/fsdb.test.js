/// const {FsDb,FsDbIndexer}=require("../fsdb")
/// const {Point,Box} = require('../geometry')
/// 
/// 
/// const fsdb=new FsDb("test")
/// fsdb.indexBy(new FsDbIndexer("test.index.spatial",e => [Point.of(e.anchor).quadrant(100).toString()]))
/// const id=(Math.random()*100).toFixed(0)
/// const sz=(Math.random()*1000+50).toFixed(0)
/// const size=Point.of({x:sz,y:sz})
/// const anchor=size.clone().alter(c=> Math.floor(Math.random()*1000+50))
/// const newItem={id:id,data:"data "+id,anchor,size}
/// console.log("new item",newItem)
/// let table=fsdb.all()
/// console.log("all::before",table)
/// fsdb.add(newItem)
/// table=fsdb.all()
/// console.log("all::after",table)
/// const f=fsdb.find({id})
/// console.log("find::new item",f)

const {Point,Box} = require('../geometry')
const {InMemoryNoSQLDatabase}=require("../imdb/InMemoryNoSQLDatabase")
const {TopologicalDatabase} = require("../fsdb")

const topodb=TopologicalDatabase.usingFile("topodb")
function getAnItem(){
    const id=(Math.random()*100).toFixed(0)
    const sz=(Math.random()*1000+50).toFixed(0)
    const size=Point.of({x:sz,y:sz})
    const anchor=size.clone().alter(c=> Math.floor(Math.random()*1000+50))
    const newItem={id:id,data:"data "+id,anchor,size}
    return newItem;
}
topodb.add(getAnItem())
topodb.add(getAnItem())
topodb.add(getAnItem())
topodb.add(getAnItem())
topodb.add(getAnItem())


console.log(topodb.db.data)
console.log(topodb.db.indexes)