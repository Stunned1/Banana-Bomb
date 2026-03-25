type LogLevel = 'debug' | 'info' | 'warn' | 'error';

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production' && level === 'debug') {
    return;
  }
  const payload = meta ? `${message} ${JSON.stringify(meta)}` : message;
  const fn =
    level === 'error'
      ? console.error
      : level === 'warn'
        ? console.warn
        : console.log;
  fn(`[banana-bomb-server] ${level}:`, payload);
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) =>
    log('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) =>
    log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) =>
    log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) =>
    log('error', message, meta),
};
