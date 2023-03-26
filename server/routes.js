
const Router = require("./router")
const FsDb = require( './fsdb')

const dbDrawables=new FsDb('drawables')
const router=new Router()

router.route({method:/GET/gi,path:/^\/drawables$/gi,handler:(data)=>{
    return dbDrawables.find()
}})
router.route({method:/POST|PUT|PATCH/gi,path:/^\/drawables$/gi,handler:(data)=>{
    for(let drawable of data){
        dbDrawables.add(drawable)
    }
    return data
}})
router.route({method:/DELETE/gi,path:/^\/drawables$/gi,handler:(data)=>{
    for(let drawable of data){
        dbDrawables.remove(drawable)
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
