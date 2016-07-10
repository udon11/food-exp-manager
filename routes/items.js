const express = require('express');
const router = express.Router();
const model = require(__dirname + '/model/itemsModel');

/**
 * Add
 */
router.get('/add', function(req, res, next) {
  var response = {
      result: "OK"
  };

  // DBへ追加
  var items = new model.Items();
  items.name = req.query.name ? req.query.name : null;
  items.type = req.query.type ? req.query.type : null;
  items.expirationDate = req.query.expirationDate ? req.query.expirationDate : null;
  items.save((err) => {
    if (err) {
      console.error(err);
      response = {
        result: "NG"
      };
    }
  });

  // レスポンスの返却
  res.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
  res.end(JSON.stringify(response));
});

/**
 * Get
 */
router.get('/get', function(req, res, next) {
  const mongoose = require('mongoose');
  console.log('process.env.MONGODB_URI' + '/' + 'fem');
  console.log(process.env.MONGODB_URI + '/' + 'fem');
  mongoose.connect(process.env.MONGODB_URI + '/' + 'fem');
  const Items = mongoose.model('Items');

  Items.find({}, function(err, docs) {
    console.log(docs);
    res.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
    res.end(JSON.stringify(response));
  });
});

/**
 * Set
 */
router.get('/set', function(req, res, next) {
  res.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
});

/**
 * remove
 */
router.get('/set', function(req, res, next) {
  res.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
});

module.exports = router;
