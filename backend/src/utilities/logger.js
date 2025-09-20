class Logger {
  // ANSI color codes
  colors = {
    reset: "\x1b[0m",
    info: "\x1b[32m", // green
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
  };

  info(message, data = {}) {
    console.log(
      `${this.colors.info}[INFO]${this.colors.reset} ${message}`,
      data
    );
  }

  warn(message, data = {}) {
    console.warn(
      `${this.colors.warn}[WARN]${this.colors.reset} ${message}`,
      data
    );
  }

  error(message, error = {}) {
    console.error(
      `${this.colors.error}[ERROR]${this.colors.reset} ${message}`,
      error
    );
  }
}

export const logger = new Logger();
