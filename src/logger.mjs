import pino from 'pino';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fileTransport = pino.transport({
	target: 'pino/file',
	options: { destination: `${__dirname}/app.log` },
});


const logger = pino({
	level: process.env.PINO_LOG_LEVEL || 'info',
	formatters: {
		level: (label) => {
			return { level: label.toUpperCase() };
		},
		bindings: (bindings) => {
			return {
				pid: bindings.pid,
				node_version: process.version,
			};
		},
	}, timestamp: pino.stdTimeFunctions.isoTime,
}, fileTransport);

export const LOGGER = logger;
