
const Router = require("./router")
const fs = require( 'fs')


const router=new Router()

router.route({method:/GET/gi,path:/^\/drawables$/gi,handler:(data)=>{
    for(let drawable of data){
        const dwString=JSON.stringify(drawable,null,' ')
        fs.appendFileSync('drawables.json',dwString)
        fs.appendFileSync('drawables.json',"\n")
    }
    return data
}})
router.route({method:/POST|PUT|PATCH/gi,path:/^\/drawables$/gi,handler:(data)=>{
    for(let drawable of data){
        const dwString=JSON.stringify(drawable,null,' ')
        fs.appendFileSync('drawables.json',dwString)
        fs.appendFileSync('drawables.json',"\n")
    }
    return data
}})
router.route({method:/DELETE/gi,path:/^\/drawables$/gi,handler:(data)=>{
    for(let drawable of data){
        const dwString=JSON.stringify(drawable,null,' ')
        fs.appendFileSync('drawables.json',dwString)
        fs.appendFileSync('drawables.json',"\n")
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
