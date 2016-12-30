/**
 * Item のスキーマ定義
 */
const connect = require('../connect');
const Schema = connect.Schema;
const moment = require('moment');
const ItemSchema = new Schema({
    name: {
        type: String
    },
    type: {
        type: String
    },
    expirationDate: {
        type: Number
    },
    created: {
        type: Number,
        default: moment().unix()
    }
});
const Item = connect.model('Item', ItemSchema);
module.exports = Item;
