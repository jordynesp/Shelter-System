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

    // set the current room to 0 first
    connection.query(`select room_num from rooms where id = ${customerID};`, (err, result) => {
        if (err) throwError(err);
        
        // get the current room number
        let roomNum = result[0].room_num;

        connection.query(`update rooms set id = 0 where room_num = ${roomNum};`, err => {
            if (err) throwError(err);
        });
    });

    // updates the new room number in customers table
    connection.query(`update customers set room_num = ${newRoom} where id = ${customerID};`, err => {
        if (err) throwError(err);
    });

    // updates the customer ID to the new room number
    connection.query(`update rooms set id = ${customerID} where room_num = ${newRoom}`, err => {
        if (err) throwError(err);
    });


    connection.query(`select * from customers where id = ${customerID};`, (err, result) => {
        if (err) throwError(err);
        
        // get the log of a customer and append a new line 
        let log = result[0].log;
        log += `| ${req.body.log} `;
        let updateLog = `update customers set log = '${log}' where id = ${customerID};`
        connection.query(updateLog, err => {
            if (err) throwError(err);
        });
    });
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

// a get method to send a list of customers and their IDs
app.get('/customerList', (req, res) => {
    let statement = `select name, id from customers`;
    connection.query(statement, (err, result) => {
        if (err) throwError(err);
        let nameIDs = [];
        Object.keys(result).forEach(key => {
            let row = result[key];
            let nameID = {
                name: row.name,
                id: row.id
            }
            nameIDs.push(nameID);
        })
        res.send(JSON.stringify(nameIDs));
    })
})

// a get method to send a list of employees and their IDs
app.get('/employeeList', (req, res) => {
    let statement = `select name, id from staff`;
    connection.query(statement, (err, result) => {
        if (err) throwError(err);
        let nameIDs = [];
        Object.keys(result).forEach(key => {
            let row = result[key];
            let nameID = {
                name: row.name,
                id: row.id
            }
            nameIDs.push(nameID);
        })
        res.send(JSON.stringify(nameIDs));
    })
})


// Set up routing
app.use("/", express.static("/app/src/pages"));
app.get("/", (req, res) => {
    res.redirect("/home.html");
});

// Make the app listen on port 8080
app.listen(port, () => {
 console.log("Server listening on http://localhost:" + port);
});
