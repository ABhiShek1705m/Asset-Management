require("dotenv").config();
const express = require('express')
const router = express.Router()
const path = require('path');
const db = require("C:\\Users\\Abhishek Majumdar\\Documents\\Asset Management App\\database.js");
const fastcsv = require("fast-csv")
const fs = require("fs");
const ws = fs.createWriteStream("assets.csv")

var q1 = `SELECT * FROM location`;
var loc = new Set();
db.query(q1, (err, results) => {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
        loc.add(results[i].city);
    }
});

var q2 = `SELECT * FROM asset_category`;
var cat = new Set();
db.query(q2, (err, results) => {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
        cat.add(results[i].category);
    }
});

var q3 = `SELECT * FROM asset_status`;
var status = new Set();
db.query(q3, (err, results) => {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
        status.add(results[i].status);
    }
})


router.get('/', (req, res) => {
    const query = `SELECT * FROM asset_master`;
    db.query(query, (err, rows) => {
        if (err) throw err;
        res.render('asset-main', { title: 'Assets', data: rows, action: 'list' });
    })
});


router.get('/add', (req, res) => {
    res.render('asset-main', { title: 'Add Asset', action: 'add', dropVals: loc, catVals: cat, statVals: status });
});

router.post('/add_data', (req, res) => {
    var assetId = req.body.aid;
    var assetName = req.body.aname;
    var assetCat = req.body.category;
    var modelName = req.body.mname;
    var modelNum = req.body.mnum;
    var snum = req.body.snum;
    var manu = req.body.manu;
    var supp = req.body.supp;
    var status = req.body.status;
    var stockLoc = req.body.stockLoc;
    var prodKey = req.body.key;
    var total = req.body.total;
    var alot;
    var onum = req.body.onum;
    var pcost = req.body.pcost;
    var pdate = req.body.pdate;
    var warr = req.body.warr;
    var eol = req.body.eol;
    // Calendar functionality for purchase date and EOL date
    pdate = new Date(pdate).toISOString().split('T')[0];
    eol = new Date(eol).toISOString().split('T')[0];

    const que = `SELECT * FROM location WHERE city = ?`;
    var loc_id;
    db.query(que, [stockLoc], (err, rows) => {
        if (err) throw err;
        loc_id = rows[0].location_id;
        const query = `INSERT INTO asset_master
    (asset_id,
        asset_name, 
        asset_serial_no,
        asset_model,
        asset_model_no,
        asset_category,
        manufacturer,
        supplier,
        asset_status,
        purchase_date,
        purchase_cost,
        order_no,
        EOL_date,
        warranty_months,
        stock_loc_id,
        product_key,
        total) values
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        db.query(query, [assetId, assetName, snum, modelName, modelNum, assetCat, manu, supp, status, pdate, pcost, onum, eol, warr, loc_id, prodKey, total], (err, data) => {
            if (err) throw err;
            console.log('Record inserted');
            res.redirect("/assets");
        });

    });

});

router.get('/update_asset/:asset_id', (req, res) => {
    var assetId = req.params.asset_id;
    que = `SELECT * FROM asset_master WHERE asset_id = "${assetId}"`
    db.query(que, (err, results) => {
        if (err) throw err;
        res.render('asset-main', {title: 'Update', action: 'edit', data: results[0], dropVals: loc, catVals: cat, statVals: status});
    })
    
})

router.post('/update_asset/:asset_id', (req, res) => {
    var assetId = req.params.asset_id;
    var assetName = req.body.aname;
    var assetCat = req.body.category;
    var modelName = req.body.mname;
    var modelNum = req.body.mnum;
    var snum = req.body.snum;
    var manu = req.body.manu;
    var supp = req.body.supp;
    var status = req.body.status;
    var stockLoc = req.body.stockLoc;
    var prodKey = req.body.key;
    var total = req.body.total;
    var alot;
    var onum = req.body.onum;
    var pcost = req.body.pcost;
    var pdate = req.body.pdate;
    var warr = req.body.warr;
    var eol = req.body.eol;
    var loc_id;

    const que = `SELECT * FROM location where city = ?`;
    db.query(que, [stockLoc], (err, result) => {
        if (err) throw err;
        loc_id = result[0].location_id;
        const query = `
    UPDATE asset_master
    SET asset_name = ?, 
        asset_serial_no = ?,
        asset_model = ?,
        asset_model_no = ?,
        asset_category = ?,
        manufacturer = ?,
        supplier = ?,
        asset_status = ?,
        purchase_date = ?,
        purchase_cost = ?,
        order_no = ?,
        EOL_date = ?,
        warranty_months = ?,
        stock_loc_id = ?,
        product_key = ?,
        total = ?
        WHERE asset_id = ?`;

        db.query(query, [assetName, snum, modelName, modelNum, assetCat, manu, supp, status, pdate, pcost, onum, eol, warr, loc_id, prodKey, total, assetId], (err, data) => {
            if (err) throw err;
            res.redirect('/assets');
        });
    })

});

router.get('/delete/:asset_id', (req, res) => {
    var asset_id = req.params.asset_id;
    var query = `DELETE FROM asset_master WHERE asset_id = "${asset_id}"`;
    db.query(query, (err, data) => {
        if (err) throw err;
        console.log('deleted');
        res.redirect("/assets");
    });
});

//Writing data in =side the CSV file
router.get('/export', (req, res) => {
    const query = `SELECT * FROM asset_master`;
    db.query(query, (err, data) => {
        if (err) throw err;
        const jsonData = JSON.parse(JSON.stringify(data));
        fastcsv.write(jsonData, { headers: true }).on("finish", function () {
            console.log('written!');
            res.redirect('/assets');
        }).pipe(ws);
    });
});

module.exports = router