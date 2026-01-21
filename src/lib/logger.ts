export type LogLevel = 'info' | 'warn' | 'error';

class Logger {
    log(level: LogLevel, message: string, meta?: Record<string, any>) {
        const timestamp = new Date().toISOString();
        console.log(JSON.stringify({
            timestamp,
            level,
            message,
            ...meta
        }));
    }

    info(message: string, meta?: Record<string, any>) {
        this.log('info', message, meta);
    }

    warn(message: string, meta?: Record<string, any>) {
        this.log('warn', message, meta);
    }

    error(message: string, meta?: Record<string, any>) {
        this.log('error', message, meta);
    }
}

export const logger = new Logger();
