const express = require('express')
const router = express.Router()
const path = require('path');
const db = require('../database');
const ejs = require("ejs");

router.get('/:approver_ID', (req, res) => {
    const approver_ID = req.params.approver_ID;
    const query = `SELECT * FROM approval_history ORDER BY created_at DESC`;
    db.query(query, (err, rows) => {        
        res.render('approval-main', {title: 'Approvals', data: rows, appID: approver_ID, action: 'home'})
    });
});


router.get('/pending/:approver_ID', (req, res) => {
    const approver_ID = req.params.approver_ID;
    const query = `SELECT * FROM approval_history WHERE request_status = 'Pending' AND approver_id = ? ORDER BY created_at DESC`;
    db.query(query, [approver_ID], (err, rows) => {
        res.render('approval-main', {title: 'Approvals', data: rows, action: 'list'})
    });
})


router.get("/:transaction_id/:approver_id", (req, res) => {
    const transacID = req.params.transaction_id;
    const approverID = req.params.approver_id;
    var req_type

    const que = `SELECT * FROM transactions WHERE transaction_id = ?` 
    db.query(que, [transacID], (err, results) =>{
        if(err) throw err;
        req_type = results[0].request_type_id;
        const que2 =`SELECT * FROM request_type WHERE request_type_id = ?`
        db.query(que2, [req_type], (err, reqq) =>{
            if(err) throw err;
            const que3 = `SELECT * FROM employee_master WHERE employee_id = ?`
            db.query(que3, [approverID], (err, app) =>{
                if(err) throw err;
                const que3 = `SELECT * FROM location WHERE location_id = ?`
                db.query(que3, [results[0].location_id], (err, locc) =>{
                    if(err) throw err;
                    res.render("approval-main", {title: 'Approval', data: results[0], req: reqq[0], App: app[0], loc: locc[0], action: 'action'})
                })
            })
        })
    })
})

//Handling the request
router.post("/handle_req/:approver_ID", (req, res) => {
    const approver_ID = req.params.approver_ID;
    const val = req.body.options;
    const assetID = req.body.assetId;
    const req_type = req.body.reqType;
    var trID;
    var asset_status = 'Available';
   

    if(val === "approve"){    //Approving the request
        const q1 = `SELECT * FROM request_type WHERE request_type_name = ?`;
            db.query(q1, [req_type], (err, reqq) => {
                if (err) throw err;
                req_id = reqq[0].request_type_id;
                const q2 = `SELECT * FROM approval_history WHERE request_type_id = ? AND request_status = ?`;
                db.query(q2, [req_id, 'Pending'], (err, transac) =>{
                    if(err) throw(err);
                    const trID = transac[0].transaction_id;
                    const que1 = `UPDATE approval_history SET request_status = ?, isApproved = ? WHERE transaction_id = ? AND approver_id = ?`;
                    db.query(que1, ['Handled', 1, trID, approver_ID], (err, result) =>{
                        if(err) throw err;
                        switch(req_type){
                            case 'Allocation':
                                asset_status = 'Allotted'
                                break;
                            case 'Deallocation':
                                asset_status = 'Available'
                                break;
                            case 'Requirement':
                                asset_status = 'Unavailable'
                                break;
                            case 'Disposal':
                                asset_status = 'Disposed'
                                break;
                            default:
                                asset_status = 'Available'
                                break;
                        }
                        const query = `UPDATE asset_master SET asset_status = ? WHERE asset_id = ?`;
                        db.query(query, [asset_status, assetID], (err, result) => {
                            if (err) throw err;
                    })
                })
            })
        })
    } 
    else if(val === "reject"){    //Rejecting the request
        const q1 = `SELECT * FROM request_type WHERE request_type_name = ?`;
        db.query(q1, [req_type], (err, reqq) => {
            if (err) throw err;
            req_id = reqq[0].request_type_id;
            const q2 = `SELECT * FROM approval_history WHERE request_type_id = ? AND request_status = ?`;
            db.query(q2, [req_id, 'Pending'], (err, transac) =>{
                if(err) throw(err);
                const trID = transac[0].transaction_id;
                const que1 = `UPDATE approval_history SET request_status = ?, isApproved = ? WHERE transaction_id = ? AND approver_id = ?`;
                db.query(que1, ['Handled', 0, trID, approver_ID], (err, statt) =>{
                    if(err) throw err;
                    const que2 = `SELECT * FROM asset_master WHERE asset_id = ?`
                    db.query(que2, [assetID], (err, status) => {
                        if(err) throw err;
                        const ast = status[0].asset_status;
                        const ex_assetStatus = ast.split(' ')[2]; 
                        const query = `UPDATE asset_master SET asset_status = ? WHERE asset_id = ?`
                        db.query(query, [ex_assetStatus, assetID], (err, results) => {
                            if (err) throw err;
                        })
                    })
                })
            })
        })
        }
    res.redirect(`/approval/${approver_ID}`);
})

module.exports = router;