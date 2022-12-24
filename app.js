const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/toDoListDB");

const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);
const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);


// ENDPOINTS:
app.get("/", function(req, res) {
    Item.find({}, function(err, results){
        if (err != null) {
            console.log(err);
        } else {
            res.render("list", 
            {
                listTitle: "Today",
                items: results,
            });
        }
    })
});

app.get("/:customListName", function(req,res) {
    const listName = _.capitalize(req.params.customListName);

    List.findOne({name: listName}, function(err, results){
        if (!err) {
            if(!results) {
                const list = new List({
                    name: listName,
                    items: []
                })
                list.save();

                res.redirect("/" + listName);
            } else {
                res.render("list", 
                {
                    listTitle: listName,
                    items: results.items,
                });
            };
        };
    });

})

app.post("/", function(req, res) {
    const listName = req.body.list
    const item = new Item({
        name: req.body.nItem,
    });

    if (listName === "Today") {
        item.save();

        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, results) {
            results.items.push(item);
            results.save();

            res.redirect("/"+listName);
        })
    }
});

app.post("/delete", function(req, res){
    const itemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        Item.findByIdAndRemove(itemId, function(err){
            if (!err) {
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate(
            {name: listName},
            {$pull: {items: {_id: itemId}}}, 
            function(err, results){
                if (!err) {
                    res.redirect("/"+listName);
                }
        });
    }
    
});


app.listen(3000, function(){
    console.log("Server started on port 3000");
})