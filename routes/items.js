const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/memo', function(err) {
  if(err){
    console.error('MongoDB connect error!');
    console.log(process.env.MONGODB_URI);
    console.error(err);
    process.exit(1);
  }
});

/**
 * スキーマ
 */
const ItemsSchema = new mongoose.Schema({
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

const Memo = mongoose.model('Items', ItemsSchema);

/**
 * Add
 */
router.get('/add', function(req, res, next) {
  var response = {
      result: "OK"
  };

  // DBへ追加
  var items = new mongoose.model('Items');
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
