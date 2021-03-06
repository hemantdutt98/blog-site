var express    = require("express"),
    mongoose   = require ("mongoose"),
    methodOverride= require("method-override")
    expressSanitizer = require("express-sanitizer")
    bodyParser = require("body-parser"),
    app        =express()
    path       =require("path")
//connecting mongoose to mongodb localhost
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("viewengine","ejs")
app.use(express.static(path.join(__dirname, '/public')));
app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(expressSanitizer())



// making schema for the database
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    created: { type:Date, default:Date.now()},
    description: String
})

//making model for the database\
var Blog = mongoose.model("Blog",blogSchema)

//adding first element to the database using create
// Blog.create({
//     title:"my first blog",
//     image: "https://images.unsplash.com/photo-1593642702909-dec73df255d7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=750&q=80",
//     description : "kjafbvjabvgdvbsdvsvdcs dvbjsd vsldvnsdbvsdn"
// })
app.get("/",(req,res)=>{
    res.render("blogs.ejs")
})
// route 1
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
//route 2 and 3 to create and post
app.get("/blogs/new",(req,res)=>{
    res.render("new.ejs")
})
app.post("/blogs",(req,res)=>{
    // creating blog here
    Blog.create(req.body.blog,(err,newBlog)=>{
        req.body.blog.description=req.sanitize( req.body.blog.description)
        if(err){
            res.redirect("new.ejs")
        }
        else{
            res.redirect("/blogs")
        }
    })
})

// 4 show route
app.get("/blogs/:id",(req,res)=>{
    Blog.findById(req.params.id,(error,foundBlog)=>{
        if(error){
            res.redirect("/blogs")
        }
        else{
            res.render("show.ejs",{blog:foundBlog})
        }
    })
})

// 5th and 6th route here.. edit and update
app.get("/blogs/:id/edit",(req,res)=>{
    Blog.findById(req.params.id,(error,editBlog)=>{
        if(error){
            res.render("/blogs")
        }
        else{
            res.render("edit.ejs",{blog:editBlog})
        }
    })
})
app.put("/blogs/:id",(req,res)=>{
    req.body.blog.description=req.sanitize( req.body.blog.description)
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,(error,updatedBlog)=>{
        if(error){
            res.render("/blogs")
        }
        else{
            res.redirect("/blogs/"+req.params.id)
        }
    })
})

// route 7 delete
app.delete("/blogs/:id",(req,res)=>{
    Blog.findByIdAndRemove(req.params.id,(error)=>{
        if(error){
            res.redirect("/blogs")
        }
        else{
            res.redirect('/blogs')
        }
    })
})


app.listen(80,()=>{
    console.log("server has started")
})