const express = require('express')
const router = express.Router()
const path = require('path');
const db = require('C:\\Users\\Abhishek Majumdar\\Documents\\Asset Management App\\database.js');

router.get('/', (req, res) => {
    var query = `SELECT * FROM approvers_master`;
    db.query(query, (err, rows) => {
        if (err) throw (err);
        res.render('approver-main', { title: 'Approvers', data: rows, action: 'list' });
    });
});

var appId = new Set();
var q1 = `SELECT * FROM users where isApprover = 1`;
db.query(q1, (err, rows) => {
    if (err) throw (err);
    for (let i = 0; i < rows.length; i++) {
        appId.add(rows[i].user_email);
    }
});

var reqId = new Set();
var q2 = `SELECT * FROM request_type`;
db.query(q2, (err, rows) => {
    if (err) throw (err);
    for (let i = 0; i < rows.length; i++) {
        reqId.add(rows[i].request_type_name);
    }
});

router.get('/add', (req, res, next) => {
    res.render('approver-main', { title: 'Add Approver', action: 'add', appNames: appId, reqName: reqId });
});

router.post('/add_data', (req, res, next) => {
    var app_email = req.body.app;
    var req_name = req.body.reqType;

    let app_id, req_id;

    const qu1 = `SELECT * FROM employee_master WHERE email_id = ?`;
    db.query(qu1,[app_email], (err, row) => {
        if (err) throw (err);
        app_id = row[0].employee_id;
        const qu2 = `SELECT * FROM request_type WHERE request_type_name = ?`;
        db.query(qu2, [req_name],(err, row) => {
            if (err) throw (err);
            console.log(row)
            req_id = row[0].request_type_id;
            const query = `INSERT INTO approvers_master (approver_id, request_type) values (?, ?)`;
            db.query(query, [app_id, req_id], (err, result) => {
                res.redirect("/approvers");
            });
        });
    });
});

router.get('/delete/:approver_id/:request_type', (req, res, next) => {
    var approver_id = req.params.approver_id;
    var request_type = req.params.request_type;
    const query = `DELETE FROM approvers_master WHERE approver_id = "${approver_id}" AND request_type = "${request_type}"`;
    db.query(query, (err, rows) => {
        if (err) throw (err);
        console.log('deleted');
        res.redirect('/approvers');
    });
});

module.exports = router;