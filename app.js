var express    = require("express"),
    mongoose   = require ("mongoose"),
    bodyParser = require("body-parser"),
    app        =express()
app.set("viewengine","ejs")

//connecting mongoose to mongodb localhost
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

// making schema for the database
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    created: { type:Date, default:Date.now()},
    decription: String
})

//making model for the database\
var Blog = mongoose.model("Blog",blogSchema)

// adding first element to the database using create
// Blog.create({
//     title:"my first blog",
//     image: "https://images.unsplash.com/photo-1593642702909-dec73df255d7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",

// })
app.get("/",(req,res)=>{
    res.render("blogs.ejs")
})
app.get("/blogs",(req,res)=>{
    Blog.find({},(error,blogs)=>{
        if(error){
            console.log(error)
        }
        else{
            res.render("blogs.ejs",{blogs:blogs})
        }
    })
})


app.listen(80,()=>{
    console.log("server has started")
})