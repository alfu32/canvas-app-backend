import express,{Express} from "express";
import {config as testServiceConfig} from './test.service'
import {config as entitiesServiceConfig} from './entities.service'
import {config as apiServiceConfig} from './api.service'
import { ServiceConfigResult } from "./meta";

const app:Express = express();

app.use(express.json());

const configuredPaths={
  ...testServiceConfig(app),
  ...entitiesServiceConfig(app),
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

