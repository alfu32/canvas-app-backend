import {Express} from "express";
import { ServiceConfigResult } from "./meta";

export function config(app:Express):ServiceConfigResult{
    app.get("/entities",async (req,res)=>{
        const response={
            req:req.body,
            date:new Date()
        }
        return response
    })
    app.post("/entities",(req,res)=>{

        const response={
            req:req.body,
            date:new Date()
        }
        return response
    })
    return {

        "POST /entities":{
            method:"GET",
            path:"/",
            response:"string",
        },
        "GET /entities":{
            method:"GET",
            path:"/",
            response:"string",
        },
    }
}