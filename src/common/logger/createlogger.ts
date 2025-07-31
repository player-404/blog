import * as winston from 'winston';
import * as winstonDaily from 'winston-daily-rotate-file';

export function createLogger(filename: string, level: string) {
  return new winstonDaily({
    level: level,
    // 保存日志文件的目录
    dirname: 'logs',
    filename: `logs/${filename}-${level}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m', // 文件最大20M
    maxFiles: '14d', // 最多保存14天
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
    ),
  });
}
