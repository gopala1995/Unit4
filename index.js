const express = require("express")

const mongoose = require("mongoose")

//------connecting----------
const connect = (()=>{
    return mongoose.connect("mongodb://127.0.0.1:27017/Gopala")
}) 

//---------schema------
const userSche = new mongoose.Schema({
    movies_name:{type:String,required:true},
    movie_genre:{type:String,required:true},
    production_year:{type:Number,required:true},
    budget:{type:Number,required:true}
})
//-------schema-model-------
const User = mongoose.model("user",userSche)

const app = express()

app.get("/",async (req,res)=>{
    const user = await User.find().lean().exec()
    return res.send(user)
})

app.listen(2345,async (req,res)=>{
    await connect()
console.log("Listening from 2345")
})
