import {Express} from "express";
import { trimIndent } from "./app";
import { ServiceConfigResult } from "./meta";

export function config(app:Express):ServiceConfigResult{
    const ingredients = [
        {
            "id": "1",
            "item": "Bacon"
        },
        {
            "id": "2",
            "item": "Eggs"
        },
        {
            "id": "3",
            "item": "Milk"
        },
        {
            "id": "4",
            "item": "Butter"
        }
    ];
    
    app.get('/', (req, res) => {
        res.send('change me to see updates, express~!');
    });
    app.get('/ingredients', (req, res) =>{
        res.send({date:new Date(),ingredients,path:"ingredients",env:process.env});
    });
    return {
        "/":{
            method:"GET",
            path:"/",
            response:"string",
        },
        "/ingredients":{
            method:"GET",
            path:"/",
            response:trimIndent(`
            {
                id: string;
                item: string;
            }[]
            `)
        },
    }
}
