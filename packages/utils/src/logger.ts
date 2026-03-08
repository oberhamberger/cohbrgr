import winston from 'winston';

const isProduction = process.env['NODE_ENV'] === 'production';

const developmentFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
        (info) =>
            `${info['timestamp']} ${info.level.toUpperCase()}: ${info.message}`,
    ),
    winston.format.colorize({ all: true }),
);

const productionFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
);

export const Logger = winston.createLogger({
    level: isProduction ? 'info' : 'debug',
    format: isProduction ? productionFormat : developmentFormat,
    // available log levels: error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
    transports: [new winston.transports.Console()],
});
