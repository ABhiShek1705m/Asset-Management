const express = require('express')
const router = express.Router()
const path = require('path');
const db = require('/Users/abhishekmajumdar/Documents/Inventory Mangement app (Node.js project)/Asset Management/database.js');
const fs = require('fs');
const ejs = require('ejs');


router.get('/admin', (req, res) => {
    console.log("hi");
    const userEmail = req.user.user_email;
    const que = `SELECT * FROM employee_master WHERE email_id = ?`;
    const que2 = `SELECT * FROM asset_master`
    db.query(que, [userEmail], (err, rows) => {    //Acquiring data from the database using SQL queries
        if (err) throw (err);
        const empID = rows[0].employee_id;
        db.query(que2, (err, result) => {
            if (err) throw (err);
            const que3 =`SELECT * FROM request_type WHERE request_type_name = ? OR request_type_name = ?`;   // Using ? as a placeholder to avoid Harmful SQL Injection
            db.query(que3, ['Requirement', 'Allocation'], (err, reqq) =>{
                if (err) throw (err);
                var reqIdRequire = null;
                var reqIdAll = null;
                for(req of reqq){
                    switch(req.request_type_name){    //Switch case condition
                        case 'Requirement':
                            reqIdRequire = req.request_type_id;
                            break;
                        case 'Allocation':
                            reqIdAll = req.request_type_id;
                            break;
                        default:
                            break;
                        }
                    }
                const que4 = `SELECT * FROM transactions ORDER BY created_at DESC`;
                db.query(que4, (err, transacs) => {
                    if(err) throw (err);
                    const emps = []; 
                    for(assets of result){
                        if(assets.asset_status === 'Allotted' | assets.asset_status === 'Unavailable'){
                            for(trsc of transacs){
                            if(trsc.asset_id === assets.asset_id){
                                if(trsc.request_type_id == reqIdAll || trsc.request_type_id == reqIdRequire){
                                    emps.push(trsc.employee_id);
                                }
                            }
                        } 
                    }
                }
                res.render('admin-home', {EmpID: empID, assets: result, employee: emps});  // Rendering admin-home page and sending variables as objects from the server 
                });
            });
        });
    });
});

//Exporting this router to use this route in the application 
module.exports = router;
