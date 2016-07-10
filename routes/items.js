const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, function (err) {
    if (err) {
      console.log('MongoDB connect error!');
      console.log(process.env.MONGODB_URI);
      console.error(err);
      process.exit(1);
    }
});

/**
 * スキーマ
 */
const Schema = mongoose.Schema;
const ItemsSchema = new Schema({
  name: {
    type: String
  },
  type: {
    type: String
  },
  expirationDate: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

const Items = mongoose.model('Items', ItemsSchema);

/**
 * Add
 */
router.get('/add', function(req, res, next) {
  var response = {
      result: "OK"
  };

  // DBへ追加
  var items = new Items();
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
  Items.find({}, function(err, docs) {
    if (err) {
      console.error('DB find error!');
      console.error(err);
      res.writeHead(500, {'Content-Type':'application/json; charset=utf-8'});
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200, {'Content-Type':'application/json; charset=utf-8'});
    res.end(JSON.stringify(docs));
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
