/**
 * 賞味期限が過ぎているItemを通知する
 */
const config = require('config');
const moment = require('moment');
const Request = require('superagent');
const Item = require('../model/schema/item');


Item.find({expirationDate: {$lte: moment().unix()}}, (err, docs) => {
    if (err) {
        throw new Error('get item error.');
    }

    // 0件なら何もしない
    if (docs.length == 0) {
        process.exit();
    }

    /*
     * 通知文の組み立て
     */
    let body = {
        value1: config.notice.prefix
    };
    docs.map((doc) => {
        doc.expirationDate = moment.unix(doc.expirationDate).format('YYYY/MM/DD');
        console.log(moment.unix(doc.expirationDate).format('YYYY/MM/DD'));
        body.value1 += doc.name + ' ' + moment.unix(doc.expirationDate).format('YYYY/MM/DD') + '<br>';
    });
    body.value1 += config.notice.suffix;

    /*
     * 通知実行
     */
    Request
        .post(config.ifttt.url)
        .type('json')
        .send(body)
        .end((err, res) => {
            if (err) {
                console.error(err);
                throw new Error(err);
            }
            console.log(res);

            /*
             * プロセス終了
             */
            process.exit();
        });
});
