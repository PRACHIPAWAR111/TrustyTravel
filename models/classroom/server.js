const express= require("express");
const app= express();
const users= require("./routes/users.js");
const posts= require("./routes/post.js");
const flash = require("connect-flash");



app.get("/getcookies", (req, res) =>{
    res.cookie("greet", "hello");
    res.send("sent to you some cookies!");
})

app.get("/",(req, res) =>{
    res.send("hii, i am root!");

});

app.use("/users",users);
app.use("/posts",posts);

app.listen(3000, () =>{
    console.log("server is listening to 3000");
});