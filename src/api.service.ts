import {Express} from "express";
import { trimIndent } from "./lib/trimIndent";
import { ServiceConfigItemDescriptor, ServiceConfigResult } from "./meta";

export function config(app:Express,configuredPaths:ServiceConfigResult):ServiceConfigResult{
    configuredPaths["/svelte-canvas-backend.postman_collection.json"]={
      method:"GET",
      path:"/svelte-canvas-backend.postman_collection.json",
      response:"json",
    } as ServiceConfigItemDescriptor
    configuredPaths["/api"]={
      method:"GET",
      path:"/api",
      response:trimIndent(`
      {
        [pathmatch: string]: ServiceConfigItemDescriptor;
      }
      `),
    } as ServiceConfigItemDescriptor
    app.get("/api",(req, res) => {
        res.send(configuredPaths)
    })
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
            const path = config.path.substring(1)
            const name = [config.method.toLowerCase(),...path.replace(/\//gi,"-").split("-")].filter(v => v!=="").join("-")
            return {
                name,
            "request": {
              "method": config.method,
              "header": [],
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