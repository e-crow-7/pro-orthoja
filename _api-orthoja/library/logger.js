import Winston from 'winston';

/**
 * Singleton logger function for application-wide logging.
 * Thank you, winston.
 */
export const Logger = (function () {

    // Logger object.
    var instance = null;

    // Message formatting.
    const errorObjectFormat = Winston.format((information, options) => {
        if(information instanceof Error) {
            const error = information;
            information.message = `${error.stack}`;
        }
        return information;
    });

    const format = Winston.format.printf(information => {
        return `${information.timestamp} [${information.level}] ${information.message}`;
    });

    // Winston logger transports.
    const transports = {
        console: new Winston.transports.Console({ level: 'debug', colorize: true }),
        file: new Winston.transports.File({ filename: 'logs/orthoja.api.log', level: 'warn' })
    };

    // Logging levels and styling.
    const levels = {
        levels: {
            fatal: 0,
            error: 1,
            warn: 2,
            info: 3,
            verbose: 4,
            debug: 5,
            silly: 6
        },
        colors: {
            fatal: 'bold black redBG',
            error: 'bold red',
            warn: 'bold yellow',
            info: 'green',
            verbose: 'italic blue',
            debug: 'italic cyan',
            silly: 'italic white'
        }
    }

    function initialize() {
        Winston.addColors(levels.colors);

        return Winston.createLogger({
            format: Winston.format.combine(
                errorObjectFormat(),
                Winston.format.timestamp(),
                Winston.format.splat(),
                format
            ),
            levels: levels.levels,
            transports: [
                transports.console,
                //transports.file
            ]
        })
    }

    return ({
        get: function () {
            if (!instance) {
                instance = initialize();
            }

            return instance;
        }
    });

})();