const express = require("express")
const router = express.Router()
const db = require("C:\\Users\\Abhishek Majumdar\\Documents\\Asset Management App\\database.js")
const bcrypt = require("bcrypt")
const path = require("path")
const fs = require("fs")
const ejs = require("ejs")


router.get("/", (req, res) => {
    const query = `SELECT * FROM employee_master`
    db.query(query, (err, rows) => {
        if(err) return console.log("error querying sql", err);
        fs.readFile("views/emp-main.ejs", "utf8", (err, template) => {
            if (err) {
                return console.log("Error reading EJS template", err);
            }
            const html = ejs.render(template, {title: "Employees", data: rows, action: "list"});
            res.send(html);
        })
    })
    
})

var sql = `SELECT * FROM department`;
var depts = new Set();
db.query(sql, (error, results) => {
    if (error) throw (error)
    for (let i = 0; i < results.length; i++) {
        depts.add(results[i].department_name);
    }
});

var sql2 = `SELECT * FROM location`;
var loc = new Set();
db.query(sql2, (error, results) => {
    if (error) throw (error)
    for (let i = 0; i < results.length; i++) {
        loc.add(results[i].city);
    }
});


router.get('/add', (req, res, next) => {
    res.render('emp-main', { title: 'Add Employee', deptVals: depts, locVals: loc, action: 'add' });
});

router.post('/add_data', (req, res, next) => {
    var fname = req.body.fname;
    var lname = req.body.lname;
    var phone = req.body.phone;
    var email = req.body.email;
    var role = req.body.role;
    var dept = req.body.dept;
    var loc = req.body.empLoc;
    var address = req.body.address;
    var deptId, locId;
    const q = `SELECT * FROM department where department_name = "${dept}"`;
    const q2 = `SELECT * FROM location where city = "${loc}"`;

    db.query(q, (err, result) => {
        if (err) throw err;
        deptId = result[0].department_id;
        console.log(deptId);
        db.query(q2, (err, result) => {
            if (err) throw err;
            locId = result[0].location_id;
            const add_q = `INSERT INTO employee_master 
            (first_name, 
            last_name, 
            phone_no, 
            email_id,
            role,
            department_id,
            location_id,
            Address) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
            db.query(add_q, [fname, lname, phone, email, role, deptId, locId, address], (err, data) =>{
                if (err) throw err;
                console.log("Records Inserted");
                res.redirect('/employee');      //Redirecting to path
            })
        })
    })
})

router.get("/update/:employee_id", (req, res) => {
    const id = req.params.employee_id;
    const que = `SELECT * FROM employee_master where employee_id = ?`
    db.query(que, [id], (err, rows) => {
        if (err) throw err;
        console.log(rows.employee_id);
        res.render('emp-main', { title: 'Update Employee', data: rows[0], deptVals: depts, locVals: loc, action: 'edit' })
    })
})

router.post('/update/:employee_id', (req, res) => {
    console.log("I am inside update route")
    var employee_id = req.params.employee_id;
    var fname = req.body.fname;
    var lname = req.body.lname;
    var phone = req.body.phone;
    var email = req.body.email;
    var role = req.body.role;
    var dept = req.body.dept;
    var loc = req.body.empLoc;
    var address = req.body.address;
    var deptId, locId;
    const q = `SELECT * FROM department WHERE department_name = "${dept}"`;
    const q2 = `SELECT * FROM location WHERE city = "${loc}"`
    console.log(employee_id)
    db.query(q, (err, dept_id) => {
        if (err) throw (err);
        deptId = dept_id[0].department_id;
        console.log(deptId);
        db.query(q2, (err, loc_id) => {
            if (err) throw (err);
            locId = loc_id[0].location_id;
            console.log(locId);
            const add_q = `
            UPDATE employee_master
            SET first_name = ?,
            last_name = ?,
            phone_no = ?,
            email_id = ?,
            role = ?,
            department_id = ?,
            location_id = ?,
            Address = ?
            WHERE employee_id = ?`;

            db.query(add_q,[fname, lname, phone, email, role, deptId, locId, address, employee_id],(err, data) => {
                if (err) throw (err);
                console.log('Record Updated');
                res.redirect("/employee");
            });
        });
    });
});

router.get('/delete/:employee_id', (req, res, next) => {
    var employee_id = req.params.employee_id;
    var query = `DELETE FROM employee_master WHERE employee_id = "${employee_id}"`;
    db.query(query, (err, data) => {
        if (err) throw (err)
        console.log('deleted');
        res.redirect("/employee");
    });
})
module.exports = router