var express = require('express');
var router = express.Router();
var model = require(__dirname + '/model/itemsModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/get/items', function(req, res, next) {
});

module.exports = router;
