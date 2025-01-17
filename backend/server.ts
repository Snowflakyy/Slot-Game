import express, {Response,Request } from "express"
import cors from "cors"
import bodyParser from "body-parser"
import data from "./exampleData/data";
import { Slot } from "./dataStructures";
import { simulateScript } from "./simulation";
const app = express();

app.use(
    cors({
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
    })
  );
  app.use(bodyParser.json());


app.post("/run-slot", async(req:Request,res:Response)=>{
  const {balance} = req.body
  try{

    const result = await simulateScript(10,balance)
    res.json({totalBalance:result})
  }
  catch(err:any){
    console.log("Error in the /run-slot endpoint",err);
    res.status(500).json({error:err.message})
  }
})

app.listen(4000, ()=> console.log("Backend server running on port 4000"));