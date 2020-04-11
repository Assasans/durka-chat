import Logger, { registerLoggers } from './helper/logger';
registerLoggers();

import * as http from 'http';
import * as chalk from 'chalk';

import { AddressInfo } from 'net';

import { App } from './app';
import { Gateway } from './websocket';
import { Config } from './helper/config';

function normalizePort(port: number): number  {
	if(port >= 1 && port <= 65535) return port;
	throw new Error(`Invalid port! (${port})`);
}

(async (): Promise<void> => {
	Logger.preinit.info(`Constructing application...`);
	const app: App = App.getInstance();
	await app.init();
	const express = app.app;
	Logger.preinit.info(`Application constructed.`);

	const config: Config = App.getInstance().getConfig();

	const port: number = normalizePort(config.web.port);
	express.set('port', port);

	const server: http.Server = http.createServer(express);

	server.listen(port, '0.0.0.0', () => {
		const serverInfo: AddressInfo = server.address() as AddressInfo;
		if(serverInfo) {
			Logger.preinit.debug(`Web server config:`);
			Logger.preinit.debug(` IP: ${chalk.greenBright(serverInfo.address)}`);
			Logger.preinit.debug(` IP Version: ${chalk.greenBright(serverInfo.family)}`);
			Logger.preinit.debug(` Port: ${chalk.greenBright(serverInfo.port)}`);  
		}
	});

	server.on('error', (error: NodeJS.ErrnoException) => {
		if(error.syscall !== 'listen') throw error;

		const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

		switch(error.code) {
			case 'EACCES': 
				console.error(`${bind} requires elevated privileges`);
				return process.exit(1);
				
			case 'EADDRINUSE': 
				console.error(`${bind} is already in use`);
				return process.exit(1);
				
			default:
				throw error;
		}
	});
	
	Logger.preinit.info(`Starting WebSocket server...`);
	const gateway: Gateway = new Gateway(server, config.gateway.path);
	app.setGateway(gateway);
	Logger.preinit.info(`WebSocket server started.`);
})();
