import {Express} from "express";
import { ServiceConfigResult } from "./meta";

interface ParsedQs { [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[] };

export class DrawableServiceResponse<T>{
    constructor(
        public req:T,
        public op:string,
        public date:Date,
    ){}
}
export function config(app:Express):ServiceConfigResult{
    app.get("/drawables",async (req,res)=>{

        const response={
            query:req['query'],
            path:req['path'],
            op:"post",
            date:new Date(),
        }
        res.send( response)
    })
    app.post("/drawables",(req,res)=>{

        const response={
            req:req.body,
            op:"post",
            date:new Date(),
        }
        res.send( response)
    })
    app.put("/drawables",(req,res)=>{

        const response={
            req:req.body,
            op:"put",
            date:new Date(),
        }
        res.send( response)
    })
    app.patch("/drawables",(req,res)=>{

        const response={
            req:req.body,
            op:"patch",
            date:new Date(),
        }
        res.send( response)
    })
    app.delete("/drawables",(req,res)=>{

        const response={
            req:req.body,
            op:"delete",
            date:new Date(),
        }
        res.send( response)
    })
    app.post("/drawables/metadata",async (req,res)=>{

        const response={
            req:req.body,
            op:"get-metadata",
            date:new Date()
        }
        res.send( response)
    })
    return {
        "GET /drawables":{
            name:"get-drawables-by-window?anchor[x]=10&anchor[y]=10&size[x]=640&size[y]=320&size[tag][name]=tag&size[tag][value]=something",
            folder:"drawables",
            method:"GET",
            path:"/drawables",
            response:"Drawable",
        },
        "POST /drawables":{
            name:"create-drawables",
            folder:"drawables",
            method:"POST",
            path:"/drawables",
            body:{date:new Date()},
            response:"Drawable",
        },
        "PUT /drawables":{
            name:"update-drawables",
            folder:"drawables",
            method:"PUT",
            path:"/drawables",
            body:{date:new Date()},
            response:"Drawable",
        },
        "PATCH /drawables":{
            name:"??-drawables",
            folder:"drawables",
            method:"PATCH",
            path:"/drawables",
            body:{date:new Date()},
            response:"Drawable",
        },
        "DELETE /drawables":{
            name:"delete-drawables",
            folder:"drawables",
            method:"DELETE",
            path:"/drawables",
            body:{date:new Date()},
            response:"Drawable",
        },
        "POST /drawables/metadata":{
            name:"get-drawables-metadata",
            folder:"drawables",
            method:"POST",
            path:"/drawables/metadata",
            body:{date:new Date()},
            response:"Drawable",
        },
    }
}