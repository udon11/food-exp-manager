const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {title: '賞味期限管理'});
});

module.exports = router;
