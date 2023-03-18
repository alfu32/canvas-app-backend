import {Express} from "express";
import { trimIndent } from "./lib/trimIndent";
import { ServiceConfigItemDescriptor, ServiceConfigResult } from "./meta";

export function config(app:Express,configuredPaths:ServiceConfigResult):ServiceConfigResult{
    configuredPaths["GET /svelte-canvas-backend.postman_collection.json"]={
      method:"GET",
      path:"/svelte-canvas-backend.postman_collection.json",
      response:"json",
    } as ServiceConfigItemDescriptor
    configuredPaths["GET /api"]={
      method:"GET",
      path:"/api",
      response:trimIndent(`
      {
        [pathmatch: string]: ServiceConfigItemDescriptor;
      }
      `),
    } as ServiceConfigItemDescriptor
    app.get("/api",(_req, res) => {
        res.send(configuredPaths)
    })
    app.get('/svelte-canvas-backend.postman_collection.json', (_req, res) => {
      res.send({
        "info": {
          "_postman_id": "7bb60766-5647-4f40-9044-37008c1c709a",
          "name": "svelte-canvas-backend",
          "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        item:Object.keys(configuredPaths).map(
          (pathexpr:string) => {
            const config:ServiceConfigItemDescriptor=configuredPaths[pathexpr]
            const path = config.path.substring(1)
            const name = [config.method.toLowerCase(),...path.replace(/\//gi,"-").split("-")].filter(v => v!=="").join("-")
            const r = {
                name,
            "request": {
              "method": config.method,
              "header": [],
              "body":{},
              "url": {
                "raw": `{{server}}${config.path}`,
                "host": [
                  "{{server}}"
                ],
                "path": [
                  path
                ]
              }
            },
          }
          if(config.body){
            r.request.body={
                "mode": "raw",
                "raw": (JSON.stringify(config.body,null,"  ")),
                "options": {
                    "raw": {
                        "language": "json"
                    }
                }
            }
          }
          return r;
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
    return {}
}