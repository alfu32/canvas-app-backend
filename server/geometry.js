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
        p.x=json?(json.x||json[0]):0;
        p.y=json?(json.y||json[1]):0;
        return p;
    }
    /**
     * @field {number} x
     */
    x;
    /**
     * @field {number} y
     */
    y;
    /**
     * deep copy of Point
     * @returns {Point}
     */
    clone(){
        return Point.of(this);
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
    quadrant(n){
        return this.clone().alter((c)=>Math.floor(c/n)*n)
    }
    /**
     * to string override
     * @returns {string}
     */
    toString(){
        return `${this.x},${this.y}`
    }
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
     * @field {Point} anchor
     */
    anchor;
    /**
     * @field {Point} size
     */
    size;
    /**
     * 
     * @param {number} scale 
     * @returns {Box[]}
     */
    getContainingBoxes(scale){
        return [Box.of(this)]
    }
}
module.exports={
    Point,
    Box
}