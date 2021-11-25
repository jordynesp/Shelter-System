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

const throwError = error => {
    console.error(error);
}

// Staff //
// a post method to add a new staff
app.post('/addStaff', (req, res) => {
    let name = req.body.name;
    let position = req.body.position;
    let statement = `insert into staff (name, position) values ('${name}', '${position}');`
    connection.query(statement, err => {
        if (err) throwError(err);
    })
    res.send();
});

// a post method to update a staff's new position
app.post('/updateStaff', (req, res) => {
    let staffID = req.body.staffID;
    let newPosition = req.body.newPosition;
    let statement = `update staff set position = ${newPosition} where id = ${staffID};`
    connection.query(statement, err => {
        if (err) throwError(err);
    });
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
        if (err) throwError(err);
    })
    let query = `select id from customers where room_num = ${room}`;
    let id;
    // get the ID of the new customer
    connection.query(query, (err, result) => {
        if (err) throwError(err);
        id = result;
        let update = `update rooms set id = ${id[0].id} where room_num = ${room}`
        // update the room to hold the ID of the new customer
        connection.query(update, err => {
            if (err) throwError(err);
        })
    })
    res.send("please");
});

// a post method to update customers
app.post('/updateCustomers', (req, res) => {
    let customerID = req.body.customerID;
    let newRoom = req.body.newRoom;
    let updateRoom = `update customers set room_num = ${newRoom} where id = ${customerID};`
    connection.query(updateRoom, err => {
        if (err) throwError(err);
    });

    let getID = `select * from rooms where id = ${customerID};`
});


// a get method to send a list of available rooms
app.get('/roomList', (req, res) => {
    let statement = `select room_num from rooms where id = 0`;
    connection.query(statement, (err, result) => {
        if (err) throwError(err);
        let rooms = [];
        Object.keys(result).forEach(key => {
            let row = result[key];
            let room = row.room_num;
            rooms.push(room);
        })
        res.send(JSON.stringify(rooms));
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
