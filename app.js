const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();



app.set("view engine", "ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "welcome to your todolist!"
});
const item2 = new Item ({
  name: "Hit the + button to add a new item."
});
const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});
const defaultItems = [item1,item2,item3];
const listSchema = {
  name: String,
  items: [itemsSchema]
}
const List= mongoose.model("list" listSchema);

Item.insertMany(defaultItems, function(err){
  if (err) {
    console.log(err);
  } else {
    console.log("successfully saved default Items to DB.");
  }
});
app.get("/", function(req, res){
  Item.find({}, function(err, foundItems){
  res.render("list", {ListTitle: "Today", Newlistitems: foundItems});
  });
});

app.post("/", function(req, res){

app.get("/:customListName", function(req, res){
  const customListName= _.capitalize(req.params.customListName);
List.findOne({name: customListName}, function(err, foundList){
  if (!err){
    if (!foundList){
      //create anewlist
      const list = new List({
        name: customListName,
        items: defaultItems
      });
      list.save();
      res.redirct("/"+ customListName);
    } else {
      //showanexistingist
      res.render("list"{ListTitle: foundList.name, Newlistitems: foundList.items});
    }
  }
});


});

const itemName = req.body.newItem;
const listName = req.body.list;
const item = new Item({
  name: itemName
});
if (listName === "Today"){
  item.save();
  res.redirct("/");
} else {
  List.findOne({name: listName}, function(err, foundList){
    foundList.items.push(item);
    foundList.save();
    res.redirct("/" + listName);
  })
}
});
  app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
      Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err) {
          console.log("successfully deleted checked item.");
          res.redirct("/");
    }
      });
    } else {
      List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList))
      if (!err){
        res.redirct("/" + listName);
      }
    });
  });


app.post("/work", function(req, res){
  let item = req.body.newitem;
  workitems.push(item);
  res.redirct("/work");
});
app.listen(3000, function(){
  console.log("server is running on port 3000");
});
