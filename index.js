const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride=require("method-override");


// setting up public directory and public enghine
app.use(express.static(path.join(__dirname, "public")));
// Setting up views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

//  importing the Chat model
const Chat = require("./models/chat.js"); 
// const methodOverride = require("method-override");

// Connecting to MongoDB
main()
  .then(() => {
    console.log("connection successful");
  })
  .catch((err) => {
    console.log("error in your code --", err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp"); 
}

// // Creating a new chat instance and saving it
// let Chat1 = new Chat({
//   from: "neha",
//   to: "priya",
//   msg: "send me your exam sheets",
//   created_at: new Date(),
// });

// Chat1.save()
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((err) => {
//     console.log(err);
//   });


//index route
app.get("/chats",async(req,res)=>{
    let chats= await Chat.find()
    
    res.render("index.ejs",{chats});
})
//New chat route

app.get("/chats/new",(req,res)=>{
    
    res.render("new.ejs")
    })

    app.post("/chats", (req, res) => {
      let { from, to, msg } = req.body;
    
      let newChat = new Chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date(),
      });
    
      newChat
        .save()
        .then((chat) => { // Renamed the variable to 'chat'
          console.log("Chat was saved");
          res.redirect("/chats"); // Move res.redirect here after successful save
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send("Error saving chat"); // Send an error response
        });
    });
    
//Edit Chat
app.get("/chats/:id/edit", async(req, res) => {
  let {id}=req.params;
  let chat= await Chat.findById(id)
  res.render("edit.ejs",{chat});
});

 //update Route
 app.put("/chats/:id",async (req,res)=>{
  let {id}=req.params;
  let{msg : newMsg}=req.body;
  
  await Chat.findByIdAndUpdate(id,{msg:newMsg },{runValidators:true, new:true} )
  res.redirect("/chats")
  

 })

 //destroy Route
 app.delete("/chats/:id",async(req,res)=>{
  let {id}=req.params;
  await Chat.findByIdAndDelete(id)
  res.redirect("/chats")

 })


// Setting up the root route
app.get("/", (req, res) => {
  res.send("root is working");
});

// Starting the server
app.listen(port, () => {
  console.log("server is listening on port", port); 
});
