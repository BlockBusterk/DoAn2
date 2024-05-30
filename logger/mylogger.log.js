const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, printf } = format;

class MyLogger {
    constructor() {
        const formatPrint = printf(({ level, message, context, requestId, timestamp, metadata }) => {
            return `${timestamp}::${level}::${context}::${message}::${JSON.stringify(metadata)}`;
        });

        this.logger = createLogger({
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                formatPrint
            ),
            transports: [
                new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: 'logs',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: combine(
                        format((info) => info.level === 'error' ? false : info)(),
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'info'
                }),
                new transports.DailyRotateFile({
                    dirname: 'logs',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: combine(
                        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: 'error'
                }),
            ]
        });
    }

    log(message, params = {}) {
        this.logger.info({ message, ...params });
    }

    error(message, params = {}) {
        this.logger.error({ message, ...params });
    }
}

module.exports = new MyLogger();
