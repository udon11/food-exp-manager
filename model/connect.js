/**
 * MongoDBへ接続
 */
const mongoose = require('mongoose');
mongoose.connect('mongodb://penguin:niugnep@ds145188.mlab.com:45188/penguin', (err) => {
    if (err) {
        console.log('MongoDB connect error!');
        console.log(process.env.MONGODB_URI);
        console.error(err);
        process.exit(1);
    }
});
module.exports = mongoose;
