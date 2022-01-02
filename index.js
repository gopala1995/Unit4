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
},{
    versionKey:false,
    timestamps:true
})
//-------schema-model-------
const User = mongoose.model("user",userSche)


//-----TagSchema------
const tagSchema = new mongoose.Schema({
    name:{type:String,required:true}
},{
    versionKey:false,
    timestamps:true
})

const Tag = mongoose.model("tag",tagSchema)

//----post schema------

const postSchema = new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    user_id:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true},
    tag_ids:[{type:mongoose.Schema.Types.ObjectId,ref:"tag",required:true}]
},{
    versionKey:false,
    timestamps:true
})

const Post = mongoose.model("post",postSchema)

//-------commennt Schema-----

const commentSchema = new mongoose.Schema({
    reply:{type:String,required:true},
    post_id:{type:mongoose.Schema.Types.ObjectId,ref:"post",required:true}
},{
    versionKey:false,
    timestamps:true
})

const Comment = mongoose.model("comment",commentSchema)

const app = express()

app.use(express.json())

app.get("/",async (req,res)=>{
    const user = await User.find().lean().exec()
    return res.send(user)
})

app.post("/",async(req,res)=>{
    try{
        const user = await User.create(req.body)
        return res.status(201).send(user)
    }catch(err){
        console.log(err.message)
    }
    
})

app.listen(2345,async (req,res)=>{
    await connect()
console.log("Listening from 2345")
})
