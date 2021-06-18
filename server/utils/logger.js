'use strict';
const Winston = require('winston');
const config = require("config");

let logger;

(function createLogger() {
    logger = Winston.createLogger({
        levels: Winston.config.syslog.levels,
        transports: [
          new Winston.transports.Console({
            format: Winston.format.combine(
                Winston.format.colorize(),
                Winston.format.simple()
            )
          }),
          // new Winston.transports.File({
          //   filename: config.get("log.filename"),
          // })
        ]
    });

    Winston.addColors({
        error: 'red',
        warn: 'yellow',
        info: 'cyan',
        debug: 'green'
    });
})();

module.exports = logger;