/**
 * @typedef Point
 */
class Point{
    /**
     * 
     * @param {{x,y}|number[]} json 
     * @returns {Point}
     */
    static of(json){
        const p = new Point();
        p.x=json?parseFloat(json.x||json[0]):0;
        p.y=json?parseFloat(json.y||json[1]):0;
        return p;
    }
    /**
     * @type {number} x
     */
    x;
    /**
     * @type {number} y
     */
    y;
    /**
     * deep copy of Point
     * @returns {Point}
     */
    clone(){
        return Point.of(this);
    }
    add(other){
        this.x+=other.x
        this.y+=other.y
        return this
    }
    sub(other){
        this.x-=other.x
        this.y-=other.y
        return this
    }
    /**
     * transforms x,y in place using the function  fn
     * @param {(number)=>number} fn transformer
     * @returns {Point} transformed point 
     */
    alter(fn){
        this.x=fn(this.x);
        this.y=fn(this.y);
        return this;
    }

    /**
     * 
     * @param {number} n precision
     * @returns {Point} the quadrant value
     */
    floor(n){
        return this.clone().alter((c)=>Math.floor(c/n)*n)
    }
    /**
     * 
     * @param {number} n precision
     * @returns {Point} the quadrant value
     */
    round(n){
        return this.clone().alter((c)=>Math.round(c/n)*n)
    }
    /**
     * 
     * @param {number} n precision
     * @returns {Point} the quadrant value
     */
    ceil(n){
        return this.clone().alter((c)=>Math.ceil(c/n)*n)
    }
    /**
     * to string override
     * @returns {string}
     */
    toString(){
        return `${this.x},${this.y}`
    }
}
function *range(a,b,s){
    const start=Math.floor(a/s)*s
    const end=Math.ceil(b/s)*s
    console.log({start,end})
    yield start
    let k=start
    while(k<=end){
        console.log({start,k,end})
        k+=s
        yield k
    }
    return end
}
/**
 * @typedef Box
 */
class Box{
    /**
     * creates a new Box object
     * @param {{anchor,size}} definition 
     * @returns {Box}
     */
    static of({anchor,size}){
        const b=new Box()
        b.anchor=anchor.clone()
        b.size=size.clone()
        return b
    }
    /**
     * @type {Point} anchor
     */
    anchor;
    /**
     * @type {Point} size
     */
    size;
    /**
     * 
     * @param {number} scale 
     * @returns {Box[]}
     */
    getSlices(scale){
        const anchor=this.anchor.clone().floor(scale)
        const size=this.anchor.clone().sub(anchor).add(this.size).ceil(scale)
        const rounded=Box.of({anchor,size})
        console.log("getSlices",this.anchor,this.size,anchor,size,rounded)
        const boxes=[]
        return []
        for(let x of range(anchor.x,anchor.x+size.x,scale)){
            for(let y of range(anchor.y,anchor.y+size.y,scale)){
                boxes.push(Box.of({anchor:Point.of({x,y}),size:Point.of({x:scale,y:scale})}))
            }
        }
        return boxes
    }
    toString(){
        return  `${anchor.toString()},${this.size.toString()}`
    }
}
module.exports={
    Point,
    Box,
    range,
}