const log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            "type": "console",
            "category": "system",
            "pattern": "-yyyy-MM-dd"
        }
    ]
});

const systemLogger = log4js.getLogger('system');
module.exports = systemLogger;