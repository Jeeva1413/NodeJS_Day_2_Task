import express from "express";
import cors from "cors";
import hallRouter from "./Routers/roomRouter.js"; 


//initialization
const app = express();
const PORT = 4000;

//middle ware
app.use(express.json());
app.use(cors());


//router 
app.use('/api',hallRouter)

app.get('/',(req,res)=>{
    res.status(200).send("API running successfully");
})


//app listening port
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
