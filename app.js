const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const date= require(__dirname+"/date.js")
const app = express();


const items=[];
const workItems=[];


app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))


app.set("view engine","ejs")


app.get("/",function(req,res){
    let day = date.getDate()

    res.render("list",{listTitle:day,newListItems:items})
});


app.post("/",function(request,response){
    let item= request.body.newItem
    
    if(request.body.list==="Work"){
        workItems.push(item)
        response.redirect("/work")
    }else{
        items.push(item)
        response.redirect("/")
    }

})


app.get("/work",function(req,res){
    res.render("list",{listTitle:"Work List",newListItems:workItems})
})


app.post("/work",function(req,rse){
    let item= request.body.newItem
    workItems.push(item)
    res.redirect("/work")
})


app.listen(process.env.PORT || 3000,function(){
    console.log("server has stared at port 3000")
})