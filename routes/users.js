const express = require('express')
const router = express.Router()
const path = require('path');
const db = require("C:\\Users\\Abhishek Majumdar\\Documents\\Asset Management App\\database.js");
const { body, validationResult} = require('express-validator');
const bcrypt = require("bcrypt");


const validationRegistration = [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('pass').trim().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be atleast 6 characters long'),
];


router.get('/', (req, res) => {
    const que = `SELECT * FROM users`;
    db.query(que, (err, rows) => {
        if (err) throw err;
        res.render('users-main', {
            title: 'Users',
            data: rows,
            action: 'list'
        });
    });
});


router.get('/add', (req, res) => {
    res.render('users-main', {title: 'Add User', action:'add'});
});

router.post('/add_data', validationRegistration, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const email = req.body.email;
    const password = req.body.pass;
    const role = req.body.role;
    const ts = new Date(Date.now());
    const formatOptions = {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'short',
        hour12: false,
        timeStyle: 'medium'
    };
    datetime = new Intl.DateTimeFormat('en-CA', formatOptions).format(ts).split(',').join('');
    console.log(ts)
    console.log(datetime);
    var mysql = `SELECT employee_id FROM employee_master where email_id = ?`;
    db.query(mysql, [email], (err, empRes) => {
        if (err) throw (err)
        if (empRes.length === 0) {
            return res.status(404).send('Employee not found');
        }

        var que = `SELECT user_id FROM users WHERE user_email = ?`;
        db.query(que,[email], (err, userRes) => {
            if (err) throw (err)
            if (userRes.length > 0) {
                return res.status(409).send('Email already registered');
            }
            console.log(email, password, role, ts);
            bcrypt.hash(password, 10, (errr, hash) => {
                if (errr) throw (errr)
                var query = `INSERT INTO users (user_email, user_password, role, createdAt) VALUES (?, ?, ?, ?)`;
                db.query(query, [email, hash, role, datetime], (error, data) => {
                    if (error) throw (error)
                    console.log('User registered');
                    res.redirect('/users');
                });

            });
        });
    });

});



router.get("/update/:user_ID", (req, res) => {
    const user_ID = req.params.user_ID;
    var query = `SELECT * FROM users WHERE user_ID = ?`;
    db.query(query, [user_ID], (err, rows) => {
        if (err) throw (err);
        res.render('users-main', { title: "Update Employee", data: rows[0], action: "update"})
    })
})

router.post("/update/:user_ID", validationRegistration, (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const userID = req.params.user_ID;
    const email = req.body.email;
    const password = req.body.pass;
    const role = req.body.role;
    const ts = new Date(Date.now());
    const isapp = req.body.Approver;
    let appval;
    if(!isapp){
        appval= 0;
    } else {
        appval = 1;
    }

    const formatOptions = {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'short',
        hour12: false,
        timeStyle: 'medium'
    };
    datetime = new Intl.DateTimeFormat('en-CA', formatOptions).format(ts).split(',').join('');

    bcrypt.hash(password, 10, (err, hash) => {
        if(err) throw err;
        var query = `UPDATE users SET user_email = ?, user_password = ?, role = ?, createdAt = ?, isApprover = ?  WHERE user_ID = ?`
        db.query(query, [email, hash, role, datetime, appval, userID], (err, results) => {
            if (err) throw err;
            console.log("Data updated");
            res.redirect('/users');
        })
})
})


router.get('/delete/:user_id', (req, res, next) => {
    var user_id = req.params.user_id;
    var query = `DELETE FROM users WHERE user_id = "${user_id}"`;
    db.query(query, (err, data) => {
        if (err) throw (err);
        res.redirect("/users")
    })
})

module.exports = router