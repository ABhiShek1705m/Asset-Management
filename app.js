//http-server ./ --> to start hosting the files on the server


// Importing node packages 
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const ejs = require('ejs');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');


// Mounting routes into the application
const db = require('./database');
const home = require('./routes/home');
const asset = require('./routes/asset');
const employee = require('./routes/employee');
const location = require('./routes/location');
const user = require('./routes/users');
const dept = require('./routes/dept');
// const service_eng = require('./routes/service-engg');  Yet to be developed 
const approvers = require("./routes/approvers");
const req = require("./routes/requests");
const approval = require("./routes/approval")

//Loading environment variables
require("dotenv").config();

//Middleware functions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');   //Setting view engine for the ejs template
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false
}));

const PORT = process.env.PORT;
const jwt_secret = process.env.SECRET_KEY;

// Cookie Authentication
const authJWT = (req, res, next) => {
    const token = req.cookies.token;
    if(token){
        jwt.verify(token, jwt_secret, (err, decoded) => {
            if(err){
                res.redirect('/login');
            }
            req.user = decoded;
            next();
        });
    } else {
        res.redirect('/login');
    }
};


//Express Validation
const validateLogin = [
    body('email').trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid Email format"),
    body('pass').trim().notEmpty().withMessage("Password is Required")
];

//Route(app) Methods
app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login-user", validateLogin, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) res.send(`<script>alert('Pls enter a valid email/password'); window.location ='/login';</script>`);
    
    const email = req.body.email;
    const password = req.body.pass;

    let query = `SELECT * FROM users WHERE user_email = ?`;
    db.query(query, [email], (err, results) => {
        if(err) throw err;
        if(results.length === 0) res.send(`<h2><b>User does not exist</b></h2>`);
        const result = results[0];
        bcrypt.compare(password, result.user_password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                const token = jwt.sign({user_email: result.user_email, role: result.role}, jwt_secret, {expiresIn: '1h'});
                res.cookie('token', token, { httpOnly: true });
                req.user_email = result.user_email;
                if(result.role === 'admin') res.redirect('/home/admin')
                // if(result.role === 'employee') res.redirect('/home/employee');
                // if(result.role === 'service_engg') res.redirect('/home/service_engg');
            } else{
                return res.send(`<script> alert('Invalid email or password'); window.location ='/login'; </script>`);
            }
        })
    })
})

app.get('/logout', authJWT, (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
})

app.get('/', (req, res) => {
    if(authJWT){
        res.redirect('/home/admin');
    }
    else {
        res.redirect('/login');
    }
})

//Mounting routes into the main application
app.use("/home", authJWT, home);
app.use("/assets", authJWT, asset);
app.use("/employee", authJWT, employee);
app.use("/location", authJWT, location);
app.use("/users", authJWT, user);
app.use("/department", authJWT,  dept);
// app.use("/service", authJWT, service_eng); To be developed further
app.use('/requests',authJWT, req);
app.use('/approvers', authJWT,approvers);
app.use('/approval', authJWT, approval);


app.listen(PORT, () => console.log(`App running on port ${PORT}`));