const {FsDb,FsDbIndexer}=require("../fsdb")

class Point{
    static of(json){
        return new Point(json.x,json.y)
    }
    x;
    y;
    constructor(x,y){
        this.x=x;this.y=y
    }
    clone(){
        return Point.of(this);
    }
    alter(fn){
        this.x=fn(this.x);
        this.y=fn(this.y);
        return this;
    }

    quadrant(n){
        return this.clone().alter((c)=>Math.floor(c/n)*n)
    }
    toString(){
        return `${this.x},${this.y}`
    }
}


const fsdb=new FsDb("test")
fsdb.indexBy(new FsDbIndexer("spatial",e => Point.of(e.anchor).quadrant(100).toString()))
const id=(Math.random()*100).toFixed(0)
const sz=(Math.random()*1000+50).toFixed(0)
const size=Point.of({x:sz,y:sz})
const anchor=size.clone().alter(c=> Math.floor(Math.random()*1000+50))
const newItem={id:id,data:"data "+id,anchor,size}
console.log("new item",newItem)
let table=fsdb.all()
console.log("all::before",table)
fsdb.add(newItem)
table=fsdb.all()
console.log("all::after",table)
const f=fsdb.find({id})
console.log("find::new item",f)

