import express,{Express} from "express";
import {config as testServiceConfig} from './test.service'
import {config as entitiesServiceConfig} from './entities.service'
import { ServiceConfigItemDescriptor, ServiceConfigResult } from "./meta";
const app:Express = express();
export function trimIndent(s:string):string{
  const lines = s.split("\n")
  const spaces=lines.reduce((min,line) => {
    if(line === null){
      return min
    }else{
      const match=line.match(/^\s+/gi)
      if(match===null){
        return 0
      } else {
        return Math.min(min,match[0].length)
      }
    }
  },Number.MAX_SAFE_INTEGER)
  return lines.map(line => line.substring(spaces)).join("\n")
}

const configuredPaths={
  ...testServiceConfig(app),
  ...entitiesServiceConfig(app),
}
configuredPaths["/svelte-canvas-backend.postman_collection.json"]={
  method:"GET",
  path:"/svelte-canvas-backend.postman_collection.json",
  response:"json",
} as ServiceConfigItemDescriptor
console.log(configuredPaths)
app.get("/api",(req, res) => {})
app.get('/svelte-canvas-backend.postman_collection.json', (req, res) => {
  res.send({
    "info": {
      "_postman_id": "7bb60766-5647-4f40-9044-37008c1c709a",
      "name": "svelte-canvas-backend",
      "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item:Object.keys(configuredPaths).map(
      (pathexpr:string) => {
        const config:ServiceConfigItemDescriptor=configuredPaths[pathexpr]
        const path = config.path.replace(/^[/]/gi,"")
        return {
        "name": `${config.method}-${path}`,
        "request": {
          "method": config.method,
          "header": [],
          "url": {
            "raw": `"{{server}}${config.path}`,
            "host": [
              "{{server}}"
            ],
            "path": [
              path
            ]
          }
        },
      }
    }),
    "variable": [
      {
        "key": "server",
        "value": "http://localhost:3000",
        "type": "default"
      }
    ]
  });
});

if (process.env.PROD !== undefined){
  app.listen(3000);
  console.log(`"PROD! : listening on port  ... ${process.env.PROD}"`)
} else {
  
  console.log(`"DEV listening on port"`)
}
export const viteNodeApp = app;

