export class GatewayInfo {
	public name: string;
	public version: string;

	public gatewayUsername: string;
	public gatewayAvatar: string;

	public gatewayConnectButton: string;
	public gatewayDisconnectButton: string;

	public buttonSendMessage: string;
	public buttonSendMessageGateway: string;

	public constructor(data: GatewayInfoData) {
		const {
			name,
			version,
			gatewayBot: {
				username: gatewayUsername,
				avatar: gatewayAvatar
			},
			ui: {
				buttons: {
					gatewayConnect: gatewayConnectButton,
					gatewayDisconnect: gatewayDisconnectButton,

					sendMessage: buttonSendMessage,
					sendMessageGateway: buttonSendMessageGateway
				}
			}
		} = data;

		this.name = name;
		this.version = version;

		this.gatewayUsername = gatewayUsername;
		this.gatewayAvatar = gatewayAvatar;

		this.gatewayConnectButton = gatewayConnectButton;
		this.gatewayDisconnectButton = gatewayDisconnectButton;

		this.buttonSendMessage = buttonSendMessage;
		this.buttonSendMessageGateway = buttonSendMessageGateway;
	}

	public toJSON() {
		return {
			name: this.name,
			version: this.version,

			gateway_username: this.gatewayUsername,
			gateway_avatar: this.gatewayAvatar,

			button_gateway_connect: this.gatewayConnectButton,
			button_gateway_disconnect: this.gatewayDisconnectButton,

			button_send_message: this.buttonSendMessage,
			button_send_message_gateway: this.buttonSendMessageGateway
		};
	}
}

export interface GatewayInfoData {
	name: string;
	version: string;

	gatewayBot: {
		username: string;
		avatar: string;
	},

	ui: {
		buttons: {
			gatewayConnect: string,
			gatewayDisconnect: string,

			sendMessage: string;
			sendMessageGateway: string;
		}
	}
}