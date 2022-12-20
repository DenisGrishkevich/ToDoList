const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");



const newItems = [];
const workItems = [];


app.get("/", function(req, res) {
    res.render("list", {listTitle: date.getDate(),
                        items: newItems,
                    });
});

app.post("/", function(req, res) {
    if (req.body.list === "Work") {
        workItems.push(req.body.nItem);
        res.redirect("/work");
    } else {
        newItems.push(req.body.nItem);
        res.redirect("/");
    }
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List",
                        items: workItems,
                    });
});



app.listen(3000, function(){
    console.log("Server started on port 3000");
})