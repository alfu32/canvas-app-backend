const http = require( 'http')
const fs = require( 'fs')
const router=require('./routes')
// @ts-ignore
// const {Drawable,Link} =require('./lib/dist/index.cjs')
const host = 'localhost';
const port = 3000;
const server = http.createServer(function (req, res) {
    const origin = req.headers.origin ||
    req.headers.referer ||
    "*";
    res.statusCode=200
    res.setHeader("Access-Control-Allow-Origin",origin)
    res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,TRACE,PATCH,OPTIONS")
    res.setHeader("Access-Control-Allow-Headers","Content-Type")
    res.setHeader("Content-Type","application/json")
    if(req.method.toUpperCase()==="OPTIONS"){
        let content=""
        res.setHeader("Content-Length",content.length)
        res.end(content);
    } else {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            let contentBuffer=""
            let reqBodyJson=null
            let rq;
            if(body){
                contentBuffer=body
                reqBodyJson=JSON.parse((contentBuffer||"").toString())
                rq={
                        path:req.url,
                        method:req.method,
                        body:reqBodyJson,
                }
            } else {
                rq={
                    path:req.url,
                    method:req.method,
                    body:null,
                }
            }
            let ent=null
            // switch(reqBodyJson._type){
            //     case "Link": ent=Link.of(reqBodyJson);break;
            //     case "Drawable": ent=Drawable.of(reqBodyJson);break;
            //     default: ent=null;break;
            // }
            if(ent){
                // const cor=ent.box.corners
                // console.log("corners")
                // console.log({cor})
            }else{
                console.log("no entity")
                console.log(contentBuffer)
            }
            const rqString=JSON.stringify(rq,null,' ')
            fs.appendFileSync('http.log',rqString)
            fs.appendFileSync('http.log',"\n")
            router.handle(rq,res)
        });
    }
});
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
