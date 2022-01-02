const express = require("express")
const { path } = require("express/lib/application")

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
    movies_name:{type:String,required:true}
},{
    versionKey:false,
    timestamps:true
})

const Tag = mongoose.model("tag",tagSchema)

//----post schema-----

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
//------user-crud------
app.get("/users",async (req,res)=>{
    const user = await User.find().lean().exec()
    return res.send(user)
})

app.post("/users",async(req,res)=>{
    try{
        const user = await User.create(req.body)
        return res.status(201).send(user)
    }catch(err){
        console.log(err.message)
        return res.status(500).send(err.message)
    }
    
})

app.get("/users/:id",async(req,res)=>{

    const user = await User.findById(req.params.id).lean().exec()
    return res.status(200).send(user)
  
})

app.patch("/users/:id",async(req,res)=>{

    const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec()
    return res.status(2001).send(user)
  
})

app.delete("/users/:id",async(req,res)=>{

    const user = await User.findByIdAndDelete(req.params.id,req.body).lean().exec()
    return res.status(200).send(user)
  
})
//-----------Tag-crud-------
app.post("/tags",async(req,res)=>{
    try{
        const tag = await Tag.create(req.body)
    return res.status(200).send(tag)
    }catch(e){
   console.log(e.message);
    }
})

app.get("/tags",async(req,res)=>{
    try{
    const tags = await Tag.find().lean().exec()
    return res.status(200).send(tags)
    }catch(e){
   console.log(e.message);
    }
})
app.get("/tags/:id",async(req,res)=>{
    const tag = await Tag.findById(req.params.id).lean().exec()
    return res.status(200).send(tag)
})

app.patch("/tags/:id",async(req,res)=>{
    const tag = await Tag.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec()
    return res.status(200).send(tag)
})

app.delete("/tags/:id",async(req,res)=>{
    const tag = await Tag.findByIdAndDelete(req.params.id).lean().exec()
    return res.status(200).send(tag)
})
//----------------POST CRUD---------

app.post("/posts",async(req,res)=>{
    const post = await Post.create(req.body)
    return res.status(200).send(post)
})

app.get("/posts",async(req,res)=>{
    const posts = await Post.find().populate({path:"user_id",select:{movies_name:1}}).populate({path:"tag_ids",select:{name:1}}).lean().exec()
    return res.status(200).send(posts)
})

app.get("/posts/:id",async(req,res)=>{
    const post = await Post.findById(req.params.id).populate({path:"user_id",select:{movies_name:1}}).populate({path:"tag_ids",select:{name:1}}).lean().exec()
    return res.status(200).send(post)
})

app.patch("/posts/:id",async(req,res)=>{
    const post = await Post.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec()
    return res.status(200).send(post)
})

app.delete("/posts/:id",async(req,res)=>{
    const post = await Post.findByIdAndDelete(req.params.id).lean().exec()
    return res.status(200).send(post)
})
//
//----------------comment CRUD---------

app.post("/comment",async(req,res)=>{
    const cmnt = await Comment.create(req.body)
    return res.status(200).send(cmnt)
})

app.get("/comment",async(req,res)=>{
    const comment = await Comment.find().populate({path:"user_id",select:{movies_name:1}}).populate({path:"tag_ids",select:{name:1}}).lean().exec()
    return res.status(200).send(comment)
})

app.get("/comment/:id",async(req,res)=>{
    const cmnt = await Comment.findById(req.params.id).populate({path:"user_id",select:{movies_name:1}}).populate({path:"tag_ids",select:{name:1}}).lean().exec()
    return res.status(200).send(cmnt)
})

app.patch("/comment/:id",async(req,res)=>{
    const cmnt = await Comment.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean().exec()
    return res.status(200).send(cmnt)
})

app.delete("/comment/:id",async(req,res)=>{
    const cmnt = await Comment.findByIdAndDelete(req.params.id).lean().exec()
    return res.status(200).send(cmnt)
})

app.listen(2345,async (req,res)=>{
    await connect()
console.log("Listening from 2345")
})
