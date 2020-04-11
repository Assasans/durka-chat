import * as express  from 'express';
import * as Handlebars from 'handlebars';
import * as hbs from 'express-handlebars';
import * as createError from 'http-errors';
import * as cookieParser from 'cookie-parser';

import * as chalk from 'chalk';
import * as path from 'path';

import { oneLine } from 'common-tags';

import { ChatRouter } from './routes/webui/v1/chat';

import { MySQL } from './helper/mysql';
import { Gateway } from './websocket';
import { ConfigHelper, Config } from './helper/config';

import Logger from './helper/logger';

export class App {
	public HeaderDeviceID: string;

	public app: express.Application;
	public gateway: Gateway;

	private static instance: App;
	public static getInstance(): App {
		if(!this.instance) this.instance = new App();
		return this.instance;
	}

	private constructor() {
		this.app = express();
	}

	private initHandlebars(): void {
		this.app.engine('hbs', hbs({
			extname: 'hbs',
			defaultLayout: 'layout',
			
			layoutsDir: path.resolve('views'),
			partialsDir: path.resolve('views/partials'),

			helpers: {
				/* eslint-disable @typescript-eslint/explicit-function-return-type */
				/* eslint-disable @typescript-eslint/no-explicit-any */
				breaklines: (input: string) => {
					let text: string = Handlebars.Utils.escapeExpression(input);
					text = text.replace(/(\r\n|\n|\r)/gm, '<br />');
					return new Handlebars.SafeString(text);
				},

				ifeq: (a: any, b: any, options: any) => {
					if(a === b) return options.fn(this);
					return options.inverse(this);
				},

				gte: (a: number, b: number, options: any) => {
					if(a >= b) return options.fn(this);
					return options.inverse(this);
				},
				/* eslint-enable @typescript-eslint/explicit-function-return-type */
				/* eslint-enable @typescript-eslint/no-explicit-any */

				scoreColor12: (score: number): Handlebars.SafeString => {
					if(score >= 10) return new Handlebars.SafeString('success');
					if(score >= 7) return new Handlebars.SafeString('warning');
					if(score >= 4) return new Handlebars.SafeString('danger');
					if(score >= 1) return new Handlebars.SafeString('danger');
					return new Handlebars.SafeString('dark');
				},
				scoreColor5: (score: number): Handlebars.SafeString => {
					if(score >= 4) return new Handlebars.SafeString('success');
					if(score >= 3) return new Handlebars.SafeString('warning');
					if(score >= 1) return new Handlebars.SafeString('danger');
					return new Handlebars.SafeString('dark');
				}
			}
		}));
		this.app.set('view engine', 'hbs');
	}

	private initMiddleware(): void {
		this.app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
			Logger.web.trace(oneLine`
				Request
				(${chalk.blueBright(request.method)})
				(${chalk.blueBright(request.ip)}/${chalk.blueBright(request.hostname)})
				${chalk.blueBright(request.path)}
			`);

			return next();
		});

		this.app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
			if(!([
				'assasans.ml',
				'localhost',
			].includes(request.hostname))) {
				return response.status(403).send('<pre>Closed test!\nForbidden!</pre>');
			}
			return next();
		});
	}

	public async init(): Promise<void> {
		if(!this.config) {
			Logger.preinit.info(`Loading config file...`);
			this.config = await ConfigHelper.getConfig();
			Logger.preinit.info(`Config file loaded.`);
		}

		this.app.set('views', path.resolve('views'));

		this.initHandlebars();
		this.initMiddleware();

		this.app.use(express.json());
		this.app.use(cookieParser());
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(express.static(path.resolve('public')));

		this.app.use('/', new ChatRouter().router);

		this.app.use((request: express.Request, response: express.Response, next: express.NextFunction) => {
			return response.status(404).send('404 Not Found');//next(createError(404));
		});

		this.app.use((error: createError.HttpError, request: express.Request, response: express.Response) => {
			response.locals.message = error.message;
			response.locals.error = error;

			response.status(error.status || 500);
			response.render('error');
		});
		
		if(!this.mysql) {
			Logger.mysql.info(`Connecting to MySQL...`);
			this.mysql = new MySQL();
			await this.mysql.create();
			Logger.mysql.info(`Connected to MySQL.`);
		}
	}

	private config: Config;
	public getConfig(): Config {
		return this.config;
	}

	private mysql: MySQL;
	public getMySQL(): MySQL {
		return this.mysql;
	}

	public setGateway(gateway: Gateway): void {
		this.gateway = gateway;
	}
}