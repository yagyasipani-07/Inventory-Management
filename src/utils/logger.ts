import { appConfig } from "@/config";

type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private log(level: LogLevel, message: string, meta?: any) {
    if (appConfig.isProduction && level === "debug") {
      return; // Skip debug logs in production
    }

    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;

    switch (level) {
      case "debug":
        console.debug(formattedMessage, meta ? meta : "");
        break;
      case "info":
        console.info(formattedMessage, meta ? meta : "");
        break;
      case "warn":
        console.warn(formattedMessage, meta ? meta : "");
        break;
      case "error":
        console.error(formattedMessage, meta ? meta : "");
        // In the future, this could be sent to an external service (e.g. Sentry)
        break;
    }
  }

  debug(message: string, meta?: any) {
    this.log("debug", message, meta);
  }

  info(message: string, meta?: any) {
    this.log("info", message, meta);
  }

  warn(message: string, meta?: any) {
    this.log("warn", message, meta);
  }

  error(message: string, meta?: any) {
    this.log("error", message, meta);
  }
}

export const logger = new Logger();
