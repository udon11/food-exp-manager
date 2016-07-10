const express = require('express');
const router = express.Router();
const fs = require('fs');
const jsonFilePath = '/var/fem/itemList.json';
const getItemList = () => {
    return new Promise((resolve) => {
        resolve(fs.readFileSync(jsonFilePath, 'utf8'));
    });
};
const addItem = (jsonStr) => {
    return new Promise((resolve, reject)=> {
        fs.writeFile(jsonFilePath, jsonStr, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(true);
        });
    });
};

/**
 * 一覧の取得
 *
 * Created by Takuya on 2016/06/04.
 */
router.get('/get', (req, res) => {
    getItemList().then((value) => {
        const json = JSON.parse(value);
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(json));
    });
});

router.get('/addItem', (req, res) => {
    getItemList().then((value)=> {
        const data = JSON.parse(value);
        data.itemList.push({
            name: req.query.name,
            expirationDate: req.query.expirationDate
        });
        addItem(JSON.stringify(data)).then(() => {
            res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify({"status": "ok"}));
        });
    });

});

module.exports = router;
