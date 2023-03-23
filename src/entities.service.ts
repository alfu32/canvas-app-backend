import {Express} from "express";
import { ServiceConfigResult } from "./meta";

export function config(app:Express):ServiceConfigResult{
    app.get("/entities",async (req,res)=>{
        const response={
            date:new Date()
        }
        res.send( response)
    })
    app.post("/entities",(req,res)=>{

        const response={
            req:req.body,
            date:new Date()
        }
        res.send( response)
    })
    return {
        "GET /entities":{
            name:"get-entities",
            folder:"entities",
            method:"GET",
            path:"/entities",
            response:"Drawable",
        },
        "POST /entities":{
            name:"save-entities",
            folder:"entities",
            method:"POST",
            path:"/entities",
            body:{date:new Date()},
            response:"Drawable",
        },
    }
}