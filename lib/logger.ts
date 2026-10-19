type LogMeta = Record<string, unknown>;

function write(level: 'info' | 'warn' | 'error', message: string, meta?: LogMeta) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  const line = JSON.stringify(entry);
  if (level === 'error') {
    console.error(line);
  } else if (level === 'warn') {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export function logInfo(message: string, meta?: LogMeta) {
  write('info', message, meta);
}

export function logWarn(message: string, meta?: LogMeta) {
  write('warn', message, meta);
}

export function logError(message: string, error?: unknown, meta?: LogMeta) {
  write('error', message, {
    ...meta,
    error: error instanceof Error ? error.message : String(error ?? 'unknown'),
  });
}
