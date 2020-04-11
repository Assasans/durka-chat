import { MySQL } from '../mysql';

export abstract class Manager {
	protected db: MySQL;

	constructor(db: MySQL) {
		this.db = db;
	}
}