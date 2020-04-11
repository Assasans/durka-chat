import { DateTime } from 'luxon';

export type Snowflake = string;

export class SnowflakeUtils {
	private static readonly EPOSCH_START: number = 1585688400;

	private constructor() {}

	public static generate(): Snowflake {
		const binMillis: string = (Math.floor(DateTime.local().toSeconds()) - this.EPOSCH_START).toString(2).padStart(42, '0');
		const random: string = Math.floor(Math.random() * 65535).toString(2).padStart(16, '0');
		const snowflake: Snowflake = BigInt(`0b${binMillis.toString()}${random}0`).toString().padStart(18, '0');
		return snowflake;
	}
}