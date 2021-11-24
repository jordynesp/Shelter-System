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
    // add staff member to database
    connection.query(statement, err => {
        if (err) console.error(err);
    })
    res.send();
});


// Customers //
// a post method to add a new customer 
app.post('/addCustomer', (req, res) => {
    let name = req.body.name;
    let room = req.body.room_num;
    let log = req.body.log;
    let statement = `insert into customers (name, room_num, log) values ('${name}', '${room}', '${log}')`;
    // add customer to database
    connection.query(statement, err => {
        if (err) console.error(err);
    })
    let query = `select id from customers where room_num = ${room}`;
    let id;
    // get the ID of the new customer
    connection.query(query, (err, result) => {
        if (err) console.error(err);
        id = result;
        let update = `update rooms set id = ${id[0].id} where room_num = ${room}`
        // update the room to hold the ID of the new customer
        connection.query(update, err => {
            if (err) console.error(err);
        })
    })
    res.send();
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
