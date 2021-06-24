import winston from 'winston';

const Logger = winston.createLogger(
    {
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.printf((info) => `${info.timestamp} ${info.level.toUpperCase()}: ${info.message}`),
            winston.format.colorize({ all: true })
        ),
        // available log levels: error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
        transports: [
            new winston.transports.Console()
        ]
    }
);

export default Logger;