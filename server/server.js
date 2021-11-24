'use strict';

// Load packages
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const port = 8080;
// Parses incoming request bodies
app.use(bodyParser.json({extended:true}));



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

// Staff //
// a post method to add a new staff
app.post('/addStaff', (req, res) => {
    let name = req.body.name;
    let position = req.body.position;
    let statement = `insert into staff (name, position) values ('${name}', '${position}')`
    connection.query(statement, err => {
        if (err) console.error(err);
    })
    res.send();
});



// Customers //
// a post method to add a new customer 
app.post('/AddingCustomer', (reg, res) => {
    let name = req.body.CustomerName;
    let room = req.body.roomNumber;
    let log = req.body.log;
    let statement = `insert into customers (name, room_num, log, check_in) values('${name}','${room}' '${log}', CURRENT_TIME)`
    connection.query(statement, (err, result) => {
        if (err)
            console.error(err);
    });
});

// Set up routing
app.use("/", express.static("/app/src/pages"));
app.get("/", (req, res) => {
    res.redirect("/home.html");
});


// Make the app listen on port 8080
app.listen(port, function() {
 console.log("Server listening on http://localhost:" + port);
});
