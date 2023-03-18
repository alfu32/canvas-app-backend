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
} as ServiceConfigResult
console.log(configuredPaths)

if (process.env.PROD !== undefined){
  app.listen(3000);
  console.log(`"PROD! : listening on port  ... ${process.env.PROD}"`)
} else {
  
  console.log(`"DEV listening on port"`)
}
export const viteNodeApp = app;

