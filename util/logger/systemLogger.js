const log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: "file",
            category: "system",
            filename: "/var/log/food-exp-manager/system.log",
            pattern: "-yyyy-MM-dd"
        }
    ]
});
const systemLogger = log4js.getLogger('system');
module.exports = systemLogger;
