import express,{Express, response} from "express";
import {config as testServiceConfig} from './test.service'
import {config as entitiesServiceConfig} from './entities.service'
import {config as drawableserviceConfig} from './drawables.service'
import {config as apiServiceConfig} from './api.service'
import { ServiceConfigResult } from "./meta";

const app:Express = express();
/**
 * 
    respondWith(body:string,contentType:string,status=200): Response{
        const origin = this.event.request.headers.get("Origin")
            ||this.event.request.headers.get("Referer")
            ||this.event.request.headers.get("origin")
            ||this.event.request.headers.get("referer")
            ||"*"
        return new Response(
            body,
            {
                status,
                headers:{
                    "content-type":contentType,
                    "Access-Control-Allow-Origin":origin,
                    "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,TRACE,PATCH,OPTIONS",
                    "Access-Control-Allow-Headers":"Content-Type"
                }
            }
        )
    }
 */
app.use(express.json());
app.use(function(req, res, next) {
  const origin = req.headers?.origin 
    || req.headers?.referer
    || "*"
  res.setHeader("Access-Control-Allow-Origin","*")
  res.setHeader("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,TRACE,PATCH,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers","Content-Type")
  
  // Put some preprocessing here.
  console.log({req,res})
  next();
})

const configuredPaths={
  ...testServiceConfig(app),
  ...entitiesServiceConfig(app),
  ...drawableserviceConfig(app),
} as ServiceConfigResult
apiServiceConfig(app,configuredPaths)
console.log(configuredPaths)

if (process.env.PROD !== undefined){
  app.listen(3000);
  console.log(`"PROD! : listening on port  ... ${process.env.PROD}"`)
} else {
  
  console.log(`"DEV listening on port"`)
}
export const viteNodeApp = app;

