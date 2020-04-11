import * as Bluebird from 'bluebird';
import * as chalk from 'chalk';
import * as _ from 'lodash';

import { Request, Response } from 'express';

import { WebUIRoute } from '../webui';

import Logger from '../../../helper/logger';

export class ChatRouter extends WebUIRoute.V1 {
	constructor() {
		super();

		this.router.get(`${this.base_path}/chat`, async (request: Request, response: Response) => {
			return response.render('chat', {
			});
		});
	}
}
