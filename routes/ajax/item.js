const express = require('express');
const router = express.Router();
const Item = require('../../model/schema/item');

/**
 * Add
 */
router.get('/add', (req, res) => {
    let response = {
        result: 'OK'
    };

    const item = new Item();
    item.name = req.query.name ? req.query.name : null;
    item.type = req.query.type ? req.query.type : null;
    item.expirationDate = req.query.expirationDate ? req.query.expirationDate : null;
    item.save((err) => {
        if (err) {
            console.error(err);
            response = {
                result: 'NG'
            };
        }
    });

    // レスポンスの返却
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    res.end(JSON.stringify(response));
});

/**
 * Get
 */
router.get('/get', (req, res) => {
    Item.find({}, {}, {sort: {expirationDate: 1}}, (err, docs) => {
        if (err) {
            console.error('DB find error!');
            console.error(err);
            res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify(docs));
    });
});

/**
 * Set
 */
router.get('/set', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
});

/**
 * remove
 */
router.get('/remove', (req, res) => {
    const removeItemId = req.query.id;
    Item.remove({_id: removeItemId}, (err) => {
        if (err) {
            console.error('Item remove error!');
            console.error(err);
            res.writeHead(500, {'Content-Type': 'application/json; charset=utf-8'});
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        res.end(JSON.stringify({result: 'ok'}));
    });
});

module.exports = router;
