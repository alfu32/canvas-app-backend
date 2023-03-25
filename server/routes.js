
const Router = require("./router")
const fs = require( 'fs')


const router=new Router()

router.route({method:/GET/gi,path:/^\/drawables$/gi,handler:(data)=>{
    for(let drawable of data){
        const dwString=JSON.stringify(drawable,null,' ')
        let fdIndex=fs.openSync('drawables.json')
        const len0=fs.fstatSync(fdIndex).size
        fs.closeSync(fdIndex)
        fs.appendFileSync('drawables.json',dwString)
        fs.appendFileSync('drawables.json',"\n")
        fdIndex=fs.openSync('drawables.json')
        const len1=fs.fstatSync(fdIndex).size
        fs.closeSync(fdIndex)

        const indexData=JSON.stringify({
            id:drawable.id,
            len0,
            len1,
        },null,' ')
        fs.appendFileSync('drawables.index.json',indexData)
        fs.appendFileSync('drawables.index.json',"\n")
    }
    return data
}})
router.route({method:/POST|PUT|PATCH/gi,path:/^\/drawables$/gi,handler:(data)=>{
    for(let drawable of data){
        const dwString=JSON.stringify(drawable,null,' ')
        let fdIndex=fs.openSync('drawables.json')
        const len0=fs.fstatSync(fdIndex).size
        fs.closeSync(fdIndex)
        fs.appendFileSync('drawables.json',dwString)
        fs.appendFileSync('drawables.json',"\n")
        fdIndex=fs.openSync('drawables.json')
        const len1=fs.fstatSync(fdIndex).size
        fs.closeSync(fdIndex)

        const indexData=JSON.stringify({
            id:drawable.id,
            len0,
            len1,
        },null,' ')
        fs.appendFileSync('drawables.index.json',indexData)
        fs.appendFileSync('drawables.index.json',"\n")
    }
    return data
}})
router.route({method:/DELETE/gi,path:/^\/drawables$/gi,handler:(data)=>{
    for(let drawable of data){
        const dwString=JSON.stringify(drawable,null,' ')
        let fdIndex=fs.openSync('drawables.json')
        const len0=fs.fstatSync(fdIndex).size
        fs.closeSync(fdIndex)
        fs.appendFileSync('drawables.json',dwString)
        fs.appendFileSync('drawables.json',"\n")
        fdIndex=fs.openSync('drawables.json')
        const len1=fs.fstatSync(fdIndex).size
        fs.closeSync(fdIndex)

        const indexData=JSON.stringify({
            id:drawable.id,
            len0,
            len1,
        },null,' ')
        fs.appendFileSync('drawables.index.json',indexData)
        fs.appendFileSync('drawables.index.json',"\n")
    }
    return data
}})

router.route({method:/GET/gi,path:/^\/drawables\/metadata$/gi,handler:(data)=>{
    const rr= {
        metadata:data.map( dw => ({
            id:dw.id,
            metadata:"is here"
        }))
    }
    console.log("sending",rr);
    return rr;
}})
router.route({method:/POST|PUT|PATCH/gi,path:/^\/drawables\/metadata$/gi,handler:(data)=>{
    const rr= {
        metadata:data.map( dw => ({
            id:dw.id,
            metadata:"is here"
        }))
    }
    console.log("sending",rr);
    return rr;
}})

module.exports=router
