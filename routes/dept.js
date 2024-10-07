const express = require('express')
const router = express.Router()
const path = require('path');
const db = require("C:\\Users\\Abhishek Majumdar\\Documents\\Asset Management App\\database.js");


router.get('/', (req, res) => {
    var query = `SELECT * FROM department`;
    db.query(query, (err, rows) => {
        if (err) throw (err);
        res.render('dept-main', {title: 'Department', action:'list', data: rows})
    });
});

router.get('/add', (req, res, next) => {
    res.render('dept-main', {title: 'Add Department', action: 'add'});
});

router.post('/add_data', (req, res, next) => {
    var dname = req.body.dname;
    const query = `INSERT INTO department (department_name) values (?)`;
    db.query(query, [dname],(err, data) => {
        if (err) throw (err);
        res.redirect("/department");
    })
});

router.get('/update/:department_id', (req, res, next) => {
    var department_id = req.params.department_id;
    var query = `SELECT * FROM department WHERE department_id = ?`;
    db.query(query, [department_id], (err, row) => {
        res.render('dept-main', {title: 'Update Department', action: 'edit', data: row[0]});
    });
});

router.post('/update/:department_id', (req, res, next) => {
    var department_id = req.params.department_id;
    var dname = req.body.dname;
    const query = `UPDATE department SET department_name = ? WHERE department_id = ?`;
    db.query(query, [dname, department_id], (err, row) => {
        if (err) throw (err);
        res.redirect('/department');
    });
});

router.get('/delete/:department_id', (req, res, next) => {
    var department_id = req.params.department_id;
    var query = `DELETE FROM department WHERE department_id = "${department_id}"`;
    db.query(query, (err, data) => {
        if (err) throw (err);
        res.redirect("/department");
    })
})
module.exports = router;