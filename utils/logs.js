import winston from "winston";
import path from 'path';

const logPath = path.join(process.cwd(), 'logs');

const logs = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({format:  "YYYY-MM-DD HH:mm:ss"}),
        winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    )
    ),
    transports: [
        new winston.transports.File({filename: `${logPath}/error.log`, level:'error'}),
        new winston.transports.File({filename: `${logPath}/combined.log`})
    ],
});

if(process.env.NODE_ENV !== 'production'){
    logs.add(new winston.transports.Console())
}

export default logs;