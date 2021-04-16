const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose")
const _ = require("lodash")

const app = express();


app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))


app.set("view engine","ejs")



mongoose.connect("mongodb+srv://admin-harshit:BOGHARAhar12@cluster0.le9wi.mongodb.net/todolistDB" , { useNewUrlParser : true ,useUnifiedTopology: true})

const itemsSchema = mongoose.Schema({
    name : String
})

const Items = mongoose.model("Item",itemsSchema)

const item1 = new Items({
    name : "Welcome to your todolist!"
})
const item2 = new Items({
    name : "Hit the + button to add new item"
})
const item3 = new Items({
    name : "<-- hit this to delete an item"
})
const defaultItems = [item1,item2,item3]

const listSchema = mongoose.Schema({
    name: String,
    items : [itemsSchema]
})
const List = mongoose.model("List",listSchema)



app.get("/",function(req,res){
    

    Items.find({},function(err,foundItems){
        if(foundItems.length === 0){
            Items.insertMany(defaultItems,function(err){
                if(err){
                    console.log(err)
                }else{
                    console.log("succesfully updated the default items to DB")
                }
            })
            res.redirect("/")
        }
        res.render("list",{listTitle:"Today",newListItems:foundItems})
    })
    
});

app.get("/:customListName",function(req,res){
    customListName = _.capitalize(req.params.customListName)

    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                // create list
                const list = new List({
                    name : customListName,
                    items : defaultItems
                })
                list.save()
                res.redirect("/"+ customListName)
            }else{
                
                res.render("list",{listTitle:foundList.name,newListItems:foundList.items})
               
            }
        }
    })


})


app.post("/",function(request,response){
    const itemName= request.body.newItem
    const listName = request.body.list


    const item = new Items({
        name : itemName
    })

    if(listName === "Today"){
        item.save()
        response.redirect("/")
    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item)
            foundList.save()
            response.redirect("/"+listName)
        })
    }

})

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox
    const listName = req.body.listName
    
    if(listName==="Today"){
        Items.findByIdAndDelete(checkedItemId,function(err){
            if(err){
                conspole.log(err)
            } else{
                console.log("succesfully deleted one item")
                res.redirect("/")
            }
        })
    }else{
        List.findOneAndUpdate({name:listName},{ $pull : {items : { _id : checkedItemId }}},function(err,foundList){
           if(!err){
            res.redirect("/"+listName)
           }
            
        })
    }
    
})





app.post("/work",function(req,rse){
    let item= request.body.newItem
    workItems.push(item)
    res.redirect("/work")
})


app.listen(process.env.PORT || 3000,function(){
    console.log("server has stared at port 3000")
})