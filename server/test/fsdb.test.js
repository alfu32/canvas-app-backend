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

const {Point,Box,range} = require('../geometry')
const {InMemoryNoSQLDatabase}=require("../imdb/InMemoryNoSQLDatabase")
const {TopologicalDatabase} = require("../fsdb")

for(let k of range(0,100,5)){
    console.log(k)
}
const b=Box.of({anchor:Point.of({x:110,y:110}),size:Point.of({x:1000,y:1000})})
console.log(b)
console.log(b.anchor.clone())
console.log(b.anchor.clone().floor(100))
console.log(b.getSlices(100))
// process.exit()


const topodb=TopologicalDatabase.usingFile("topodb")
function getAnItem(id=Math.floor(Math.random()*100)){
    // const id=Math.floor(Math.random()*100)
    const size=Point.of({}).alter(c=> Math.floor(Math.random()*1000+50))
    const anchor=size.clone().alter(c=> Math.floor(Math.random()*2000-1000))
    const newItem={id:id,data:"data "+id,anchor,size}
    return newItem;
}
for(let id of range(1,1000,1)){
    topodb.add(getAnItem(id))
}
//// topodb.add(getAnItem())
//// topodb.add(getAnItem())
//// topodb.add(getAnItem())
//// topodb.add(getAnItem())


console.log("data",topodb.db.data)
console.log("indexers",topodb.db.indexers)
console.log("indexes",topodb.db.indexes)
