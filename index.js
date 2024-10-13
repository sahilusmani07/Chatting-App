const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

// Setting up public directory and view engine
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Importing the Chat model
const Chat = require("./models/chat.js");

// Connecting to MongoDB
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
  console.log("connection successful");
}
main().catch((err) => {
  console.log("error in your code --", err);
});

// Async wrapper function to handle errors
function asyncwrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(next); // Automatically catch and pass errors to the next middleware
  };
}

// Index route
app.get("/chats", asyncwrap(async (req, res) => {
  let chats = await Chat.find();
  res.render("index.ejs", { chats });
}));

// New chat route
app.get("/chats/new", (req, res) => {
  res.render("new.ejs");
});

// New chat post request
app.post("/chats", asyncwrap(async (req, res) => {
  let { from, to, msg } = req.body;
  let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at: new Date(),
  });
  await newChat.save();
  console.log("Chat was saved");
  res.redirect("/chats");
}));

// Edit Chat route
app.get("/chats/:id/edit", asyncwrap(async (req, res) => {
  let { id } = req.params;
  let chat = await Chat.findById(id);
  if (!chat) {
    throw new ExpressError(404, "Chat not found");
  }
  res.render("edit.ejs", { chat });
}));

// Update Route
app.put("/chats/:id", asyncwrap(async (req, res) => {
  let { id } = req.params;
  let { msg: newMsg } = req.body;
  await Chat.findByIdAndUpdate(id, { msg: newMsg }, { runValidators: true, new: true });
  res.redirect("/chats");
}));

// Destroy Route
app.delete("/chats/:id", asyncwrap(async (req, res) => {
  let { id } = req.params;
  await Chat.findByIdAndDelete(id);
  res.redirect("/chats");
}));

// Setting up the root route
app.get("/", (req, res) => {
  res.send("root is working");
});

// Validation error handler
const HandleValidationError = (err, res) => {
  console.log("This is a ValidationError");
  console.dir(err.message);
return err;
};

// Specific error handling middleware
app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === "ValidationError") {
    return HandleValidationError(err); // Handle validation error directly
  }
  next(err); // Pass other errors to the next middleware
});



// Centralized error handling middleware for non-validation errors
app.use((err, req, res, next) => {
  let { status = 500, message = "Internal Server Error" } = err;
  res.status(status).send(message);
});

// Starting the server
app.listen(port, () => {
  console.log("server is listening on port", port);
});
