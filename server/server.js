'use strict';

// Load packages
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const port = 8080;
// Parses incoming request bodies
app.use(bodyParser.urlencoded({extended:true}));


// Connect to the mysql databse
const connection = mysql.createConnection({
    host: 'mysql',
    port: '3306',
    user: 'root',
    password: 'admin'
});
connection.connect(err => {
    if (err) throw err;
    connection.query("USE shelter;", (err, result) => {
        if (err) throw err;
        console.log("Connected to database!");
    })
});

// a post method to add a new staff
app.post('/AddingStaff', (req, res) => {
    let name = req.body.name;
    let id = req.body.id;
    let position = req.body.position;
    let statement = `insert into staff (name, id, position) values ('${name}', '${id}', '${position}')`
    connection.query(statement, (err, result) => {
        if (err)
            console.error(err);
    })
})



// Set up routing
app.use("/", express.static("/app/src/pages"));
app.get("/", (req, res) => {
    res.redirect("/home.html");
});


// Make the app listen on port 8080
app.listen(port, function() {
 console.log("Server listening on http://localhost:" + port);
});
