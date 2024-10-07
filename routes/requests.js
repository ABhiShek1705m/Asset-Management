const express = require('express')
const router = express.Router()
const path = require('path');
const db = require('../database');


router.get('/', (req, res) => {
    const query = `SELECT * FROM transactions ORDER BY created_at DESC`;
    db.query(query, (err, rows) => {
        if (err) throw (err);
        res.render('request-main', { title: 'Requests', data: rows, action: 'list' });
    });
});

var reqVals = new Set();
var assetVals = new Set();
var empVals = new Set();
var locVals = new Set();



const q1 = `SELECT * FROM request_type`;
db.query(q1, (err, rows) => {
    if (err) throw (err);
    for (let i = 0; i < rows.length; i++) {
        reqVals.add(rows[i].request_type_name);
    }
});

const q2 = `SELECT * FROM asset_master WHERE asset_status != 'Disposed'`;
db.query(q2, (err, rows) => {
    if (err) throw (err);
    for (let i = 0; i < rows.length; i++) {
        assetVals.add(rows[i].asset_id + ',' + rows[i].asset_name);
    }
    });


// const que = `SELECT * FROM asset_master WHERE asset_status != 'Available' AND asset_status != 'Disposed'`;
// db.query(que, (err, rows) => {
//     if (err) throw (err);
//     for (let i = 0; i < rows.length; i++) {
//         assetValsExisting.add(rows[i].asset_id + ',' + rows[i].asset_name);
//     }
// });

const q3 = `SELECT * FROM employee_master`;
db.query(q3, (err, rows) => {
    if (err) throw (err);
    for (let i = 0; i < rows.length; i++) {
        empVals.add(rows[i].email_id);
    }

});

const q4 = `SELECT * FROM location`;
db.query(q4, (err, rows) => {
    if (err) throw (err);
    for (let i = 0; i < rows.length; i++) {
        locVals.add(rows[i].location_id + ',' + rows[i].building + ',' + rows[i].city);
    }
});


router.get('/add', (req, res, next) => {
    res.render('request-main', { title: 'New Request', action: 'add', reqType: reqVals, assets: assetVals, emps: empVals, locs: locVals });
});

router.post('/add_data', (req, res, next) => {
    const req_type = req.body.reqType;
    const asset = req.body.asset;
    const tempAssetArray = asset.split(",");
    const assetID = tempAssetArray[0];
    let isValid  = false;
    const que1 = `SELECT * FROM asset_master WHERE asset_id = ?`
    db.query(que1, [assetID], (err, rows) => {
        if (err) throw (err);
        const asset_status = rows[0].asset_status;
        if(asset_status === 'Available'){
            switch(req_type){
                case 'Allocation':
                    isValid = true;
                    break;
                case 'Requirement':
                    isValid = true;
                    break;
                case 'Disposal':
                    isValid = true;
                    break;
                case 'Deallocation':
                    isValid = false;
                    break;
                default:
                    isValid = false;
                    break;
            }
        } else if(asset_status === 'Allotted'){
            switch(req_type){
                case 'Allocation':
                    isValid = false;
                    break;
                case 'Requirement':
                    isValid = true;
                    break;
                case 'Disposal':
                    isValid = false;
                    break;
                case 'Deallocation':
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;
            }
        } else if(asset_status ==='Unavailable'){
            switch(req_type){
                case 'Allocation':   //Send alerts if the asset status is unavailable
                    res.send('<script>alert("Sorry this asset is currently unavailable); window.location = ("/requests");</script>')
                    break;
                case 'Requirement':
                    res.send('<script>alert("Sorry this asset is currently unavailable); window.location = ("/requests");</script>')
                    break;
                case 'Disposal':
                    res.send('<script>alert("Sorry this asset is currently unavailable); window.location = ("/requests");</script>')
                    break;
                case 'Deallocation':
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;
                }
            }                             
    console.log('Valid Request', isValid)
    const que = `UPDATE asset_master SET asset_status = ? WHERE asset_id = ?`
    if(isValid && asset_status === 'Available') {
        db.query(que, [`Requested - ${asset_status} => ${req_type}`, assetID], (err, results) => {
            if(err) throw(err);
            validReq();
        })
    } else if(!isValid){
        return res.send(`<script> alert('invalid request'); window.location = '/requests'; </script>`);
    
    }
    function validReq(){
        const emp = req.body.emp;
        const loc = req.body.loc;
        const desc = req.body.desc;
        const cr = req.body.cr;
        var locid = parseInt(loc.split(',')[0]);
        //Acquiring current timestamp
        const ts = new Date(Date.now());
        const formatOptions = {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'short',
            hour12: false,
            timeStyle: 'medium'
        };                        
        datetime = new Intl.DateTimeFormat('en-CA', formatOptions).format(ts).split(',').join('');
        var reqid, empid;
        const qu1 = `SELECT * FROM request_type WHERE request_type_name = "${req_type}"`;
        db.query(qu1, (err, rows) => {
            if (err) throw (err);
            reqid = rows[0].request_type_id;
            const qu2 = `SELECT * FROM employee_master WHERE email_id = "${emp}"`;
            db.query(qu2, (err, rows) => {
                if (err) throw (err);
                empid = rows[0].employee_id;
                const query = `INSERT INTO transactions(request_type_id, asset_id, employee_id, location_id, description, created_by, created_at) VALUES (?,?,?,?,?,?,?)`;
                db.query(query, [reqid, assetID, empid, locid, desc, cr, datetime], (err, data) => {
                    if (err) throw (err);
                    const tid_que = `SELECT * FROM transactions WHERE request_type_id = ? AND asset_id = ? AND employee_id = ?`;
                    db.query(tid_que, [reqid, assetID, empid], (err, resultt) => {
                        if (err) throw (err);
                        var txn_id = resultt[0].transaction_id;
                        const query2 = `SELECT * FROM approvers_master WHERE request_type = "?"`;
                        var app_ids = [];
                        db.query(query2, [reqid], (err, results) => {
                            if (err) throw (err);
                            for (let i = 0; i < results.length; i++) {
                                app_ids.push(results[i].approver_id);
                            }
                            for (let i = 0; i < app_ids.length; i++) {
                                const query3 = `INSERT INTO approval_history (transaction_id, request_type_id, approver_id, created_at) VALUES (?,?,?,?)`;
                                db.query(query3, [txn_id, reqid, app_ids[i], datetime], (err, row) => {
                                    if(err) throw (err);
                                });
                            }
                            res.redirect('/requests');
                        });
                    })
    
                });
            });
        });
        } 
});  
});





module.exports = router;