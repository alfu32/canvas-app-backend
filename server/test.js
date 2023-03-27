
module.exports={describe,beforeEach,it,expect}

const tests={}
let current;
let name;
class TestSuite{
    description
    fn
    tests={}
    beforeEach=()=>{}
    static of({description,fn}){
        const ts=new TestSuite();
        ts.description=description;
        ts.fn=fn;
        ts.tests={}
        ts.beforeEach=()=>{}
        return ts;
    }
    toString(){
        return `
        TestSuite{
            description: ${this.description.toString()}
            fn: ${this.fn.toString()}
            tests: ${Object.entries(this.tests).map(([name,val])=>`"${name}":${val.toString}`).join("\n                 ")}
            beforeEach: ${this.beforeEach.toString()}
        }
        `
    }
    results(){
        return Object.entries(this.tests).reduce(
            (a,[k,v]) => {
                a[k]=v.results
                return a;
            },{}
        )
    }
}
function describe(description,fn){
    current=TestSuite.of({description,fn})
    tests[description]=current
    console.log(tests)
    fn.apply(current,[])
}
function beforeEach(fn){
    current.beforeEach=fn
    console.log(tests)
}
function it(description,fn){
    current.tests[description]={
        description,
        fn,
        results:{}
    }
    console.log(tests)
    current.beforeEach.apply(current,[])
    name=description
    fn.apply(description,[])
}
class Expect{
    e
    results={}
    calledWith=[]
    wasCalled=false
    static of(e){
        const t=new Expect()
        t.e=e
        if(typeof e === "function"){
            t.e=function(...args){
                t.wasCalled=true
                t.calledWith=args
            }
        }
        return t;
    }
    toEqual(v){
        this.results["toEqual"]=v
        return (this.e===v)
    }
    toHaveBeenCalledWith(p){
        this.results["toHaveBeenCalledWith"]=p
        console.log(p,this.calledWith)
    }
    toHaveBeenCalled(){
        this.results["toHaveBeenCalled"]=this.wasCalled
        return this.wasCalled
    }
    toBeUndefined(){
        this.results["toBeUndefined"]=typeof(this.e)
        return (typeof(this.e) === "undefined")
    }
    get not(){
        const t=this;
        return {
            toEqual(v){return !t.toEqual(v)},
            toHaveBeenCalled(p){return !t.toHaveBeenCalled(p)},
            toHaveBeenCalledWith(p){return !t.toHaveBeenCalledWith(p)},
            toBeUndefined(){return !t.toBeUndefined()},
        }
    }
}
function expect(expectedValue,result){
    current.tests[name]=Expect.of(expectedValue,result)
    //console.log(tests)
    Object.entries(tests).forEach(([n,v])=>{
        console.log(n)
        console.log(v.results())
    })
    return current.tests[name]
}