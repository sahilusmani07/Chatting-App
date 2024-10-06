const mongoose  = require("mongoose"); 
const Chat = require("./models/chat.js"); 


// Connecting to MongoDB   this  init.js we use for sample data
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

// Creating a new chat instance and saving it
let allchat=[
    {
        from: "Ayan",
        to: "Sahil",
        msg: "send me your code sheets",
        created_at: new Date(),
      },
{
    from: "Sahil",
    to: "Suzel",
    msg: "How is your job is going on ",
    created_at: new Date(),
},
{
    from: "Sahil",
    to: "Sultan",
    msg: "Are you coming in gym today ?",
    created_at: new Date(),
}


];

Chat.insertMany(allchat);