// This server is completely optional, its only purpose is to be a base server so you can implement more functions with express!
var express = require("express")
var app = express()

app.use(express.static("./public"));

app.listen(3000, console.log('Server is running on port 3000'))