const express = require('express')
const router = express.Router()
const path = require('path');
const db = require("C:\\Users\\Abhishek Majumdar\\Documents\\Asset Management App\\database.js");
const fs = require('fs');
const ejs = require('ejs');
const { body, validationResult } = require("express-validator")

const validateLoc = [
    body("floor").trim().notEmpty().withMessage("Floor Cannot be empty").isInt().withMessage("pls enter a number"),
    body("building").trim().notEmpty().withMessage("Field cannot be empty"),
    body("area").trim().notEmpty().withMessage("Field cannot be empty"),
    body("city").trim().notEmpty().withMessage("Field cannot be empty"),
    body("state").trim().notEmpty().withMessage("Field cannot be empty"),
    body("country").trim().notEmpty().withMessage("Field cannot be empty"),
    body("pin").trim().notEmpty().withMessage("Field cannot be empty")
]

router.get('/', (req, res) => {
    const query = `SELECT * FROM location`;
    console.log('location table')
    db.query(query, (err, rows) => {
        if(err){
            console.error('Error querying MySQL:', err);
            return;
        }
        fs.readFile('views/loc-main.ejs', 'utf8', (err, template) => {
            if(err) {
                console.error('Error reading EJS template:', err);
                return;
            }
            const html = ejs.render(template, { title: 'Location', data: rows, action:'list'});
            res.send(html);
        });
    });

});

router.get('/add', (req, res, next) => {
    fs.readFile('views/loc-main.ejs', 'utf8', (err, template) => {
        if(err) {
            console.error('Error reading EJS template:', err);
            return;
        }
        const html = ejs.render(template, { title: 'Add Location', action:'add'});
        res.send(html);
    });
    res.render("loc-main", {title:'Location', action:'add'});
});

router.post('/add_data', validateLoc, (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => `Field: ${error.path}; Error: ${error.msg}`).join('\\n');
        return res.send(`<script> alert("${errorMessages}"); window.location='/location/add_data'; </script>`);
    }
    var floor = req.body.floor;
    var building = req.body.building;
    var area = req.body.area;
    var city = req.body.city;
    var state = req.body.state;
    var country = req.body.country;
    var pin = req.body.pin;

    
    const mysql = `INSERT INTO location (country, state, city, area, pincode, building, floor) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(mysql, [country, state, city, area, pin, building, floor], function(err, data){
        if (err) throw err;
        console.log('Record inserted');
        res.redirect("/location");
    });

});

router.get('/update/:location_id', (req, res, next) => {
    var location_id = req.params.location_id;
    console.log(location_id);
    var query = `SELECT * FROM location WHERE location_id = "${location_id}"`;
    db.query(query, (error, row) => {
        res.render('loc-main', {title: 'Update Location', action:'edit', data:row[0]});
    });
});

router.post('/update/:location_id', validateLoc, (req, res, next) => {
    var location_id = req.params.location_id;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => `Field: ${error.path}; Error: ${error.msg}`).join('\\n');
        return res.send(`<script> alert("${errorMessages}"); window.location='/location/update/${location_id}'; </script>`);
        }

    var floor = req.body.floor;
    var building = req.body.building;
    var area = req.body.area;
    var city = req.body.city;
    var state = req.body.state;
    var country = req.body.country;
    var pin = req.body.pin;

    var query = `
    UPDATE location 
    SET country = ?,
    state = ?,
    city = ?,
    area = ?,
    building = ?,
    floor = ?,
    pincode = ?
    WHERE location_id = ?`;

    db.query(query, [country, state, city, area, pin, building, floor, location_id], (err, data) =>{
        if (err) throw err
        res.redirect('/location');
    });
});

router.get('/delete/:location_id', (req, res, next) =>{
    var location_id = req.params.location_id;
    var query = `DELETE FROM location WHERE location_id = "${location_id}"`;
    db.query(query, (err, data) => {
        if (err) throw (err)
        console.log('Record deleted')
        res.redirect("/location");
    });
});
module.exports = router