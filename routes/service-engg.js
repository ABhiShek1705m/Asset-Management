const express = require('express')
const router = express.Router()
const path = require('path');
const db = require('C:\\Users\\Abhishek Majumdar\\Documents\\Asset Management App\\database.js');
const fs = require('fs');
const ejs = require('ejs');

router.get('/', (req, res) => {
    const query = `SELECT * FROM service_engg`;
    console.log('engg table')
    db.query(query, (err, rows) => {
        if(err){
            console.error('Error querying MySQL:', err);
            return;
        }
        fs.readFile('views/engg-main.ejs', 'utf8', (err, template) => {
            if(err) {
                console.error('Error reading EJS template:', err);
                return;
            }
            const html = ejs.render(template, { title: 'Service Engineers', data: rows, action:'list'});
            res.send(html);
        });
    });
});

router.get('/add', (req, res, next) => {
    fs.readFile('views/engg-main.ejs', 'utf8', (err, template) => {
        if(err) {
            console.error('Error reading EJS template:', err);
            return;
        }
        const html = ejs.render(template, { title: 'Add Engineer', action:'add'});
        res.send(html);
    });
});

router.post('/add_data', (req, res, next) => {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var phone = req.body.phone;
    var email = req.body.email;
    var role = req.body.role;

    const mysql = `INSERT INTO service_engg (first_name, last_name, phone_num, email_id, role) values (?,?,?,?,?)`;
    db.query(mysql,[fname, lname, phone, email, role], (err, data) =>{
        if (err) throw (err);
        console.log('Record Inserted');
        res.redirect("/service");
    });
});

router.get('/update/:engg_id', (req, res, next) => {
    console.log('edit');
    var engg_id = req.params.engg_id;
    console.log(engg_id);
    var query = `SELECT * FROM service_engg WHERE engg_id = "${engg_id}"`;
    db.query(query, (err, row) => {
        console.log(row);
        res.render('engg-main', {title: 'Update Engineer', action:'edit', data:row[0]});
    });
});

router.post('/update/:engg_id', (req, res, next) => {
    var engg_id = req.params.engg_id;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var phone = req.body.phone;
    var email = req.body.email;
    var role = req.body.role;

    var query = `
    UPDATE service_engg
    SET first_name= ?,
    last_name = ?,
    phone_num = ?,
    email_id = ?,
    role = ?
    WHERE engg_id = ?`;

    db.query(query, [fname, lname, phone, email, role, engg_id], (err, data) => {
        if (err) throw (err)
        res.redirect('/service');
    });
});

router.get('/delete/:engg_id', (req, res, next) => {
    var engg_id = req.params.engg_id;
    var query = `DELETE FROM service_engg WHERE engg_id = ?`;
    db.query(query,[engg_id], (err, data) => {
        if (err) throw (err)
        console.log('deleted');
        res.redirect("/service");
    });
});
module.exports = router;