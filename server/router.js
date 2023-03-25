const handlers=[]
class Router{
    handlers=[]
    route({method=/GET|POST|DELETE|PATCH|PUT|TRACE/gi,path=/\/.*/gi,handler=(data)=>data}){
        this.handlers.push({
            method,
            path,
            handler,
        })
        console.log("config",this.handlers)
    }
    handle(rq,response){
        console.log("handling",rq.method,rq.path)
        for(let cfg of this.handlers){
                const mmethod=rq.method.match(cfg.method)
                const mpath=rq.path.match(cfg.path)
                if( mmethod && mpath ){
                    console.log("handling",rq.method,mmethod,rq.path,mpath,cfg.handler)
                    const r = cfg.handler(rq.body)
                    const content=JSON.stringify(r,null,' ')

                    response.setHeader("Content-Length",content.length)
                    response.end(content);
                    return;
                }else{
                    console.log("no match for",rq.method,mmethod,rq.path,mpath)
                }
            }
    }
}
module.exports=Router