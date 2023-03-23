import {Express} from "express";
import { trimIndent } from "./lib/trimIndent";
import { map, ServiceConfigItemDescriptor, ServiceConfigResult } from "./meta";

export function config(app:Express,configuredPaths:ServiceConfigResult):ServiceConfigResult{
    configuredPaths["GET /svelte-canvas-backend.postman_collection.json"]={
      name:"postman-collection-json",
      folder:"api",
      method:"GET",
      path:"/svelte-canvas-backend.postman_collection.json",
      response:"json",
    } as ServiceConfigItemDescriptor;
    configuredPaths["GET /api"]={
      name:"api-definitions",
      folder:"api",
      method:"GET",
      path:"/api",
      response:trimIndent(`
      {
        [pathmatch: string]: ServiceConfigItemDescriptor;
      }
      `),
    } as ServiceConfigItemDescriptor;
    configuredPaths["GET /api/byFolder"]={
      name:"api-definitions-by-folder",
      folder:"api",
      method:"GET",
      path:"/api/byFolder",
      response:trimIndent(`
      {
        [pathmatch: string]: map<ServiceConfigItemDescriptor>;
      }
      `),
    } as ServiceConfigItemDescriptor;

    const groupByFolders=Object.keys(configuredPaths).reduce(
      (folders:map<ServiceConfigItemDescriptor[]>,pathexpr:string) => {
        const config:ServiceConfigItemDescriptor=configuredPaths[pathexpr]
        const folderName=config.folder
        folders[folderName]=folders[folderName]||[]
        folders[folderName].push(config)
        return folders
      },{} as map<ServiceConfigItemDescriptor[]>
    )
    app.get("/api",(_req, res) => {
        res.send(configuredPaths)
    })
    app.get("/api/byFolder",(_req, res) => {
        res.send(groupByFolders)
    })
    app.get('/svelte-canvas-backend.postman_collection.json', (_req, res) => {
      res.send({
        "info": {
          "_postman_id": "7bb60766-5647-4f40-9044-37008c1c709a",
          "name": "svelte-canvas-backend",
          "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        item:Object.keys(groupByFolders)
          .map( (folder:string) => {
            return {
              name:folder,
              item:groupByFolders[folder].map(
                (config:ServiceConfigItemDescriptor) => {
                  return configToPostmanJson(config);
              }),
            }
          }
        ),
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

function configToPostmanJson(config: ServiceConfigItemDescriptor) {
  const path = config.path.substring(1);
  const name = config.name||[config.method.toLowerCase(), ...path.replace(/\//gi, "-").split("-")].filter(v => v !== "").join("-");
  const r = {
    name,
    "request": {
      "method": config.method,
      "header": [],
      "body": {},
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
  };
  if (config.body) {
    r.request.body = {
      "mode": "raw",
      "raw": (JSON.stringify(config.body, null, "  ")),
      "options": {
        "raw": {
          "language": "json"
        }
      }
    };
  }
  return r;
}
