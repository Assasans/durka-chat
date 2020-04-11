import { Router } from 'express';

export abstract class WebUIRoute {
	public abstract base_path: string;
	
	public router: Router;

	constructor() {
		this.router = Router();
	}

	static V1 = class V1 extends WebUIRoute {
		public base_path: string = '/webui/v1';
	}
}