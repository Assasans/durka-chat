const cachedUsers = [];
const cachedMesages = [];
const cachedChannels = [];

let gatewayInfo = null;
let currentChannel = null;

function setUsers(users) {
	const usersElement = $('#users');
	usersElement.empty();

	users.forEach((user, index) => {
		cachedUsers.push(user);

		const element = $('<div class="user"></div>');
		const userInfo = $('<div class="user-info"></div>');

		const userAvatar = $('<img class="user-avatar">');
		const username = $('<a class="user-username"></a>');
		//const userId = $('<a class="user-username"></a>');

		const buttonDisconnect = $('<button class="user-button-disconnect">Отключить</button>');

		userAvatar.prop('src', user.avatar ? user.avatar.hash : '/images/avatars/default.png');

		username.text(`${user.username}#${user.discriminator}`);

		//userId.text(`(ID ${user.id})`);


		userInfo.append(username);
		//userInfo.append($('<br />'));
		//userInfo.append(userId);

		element.append(userAvatar);
		element.append(userInfo);

		//userInfo.append(buttonDisconnect);
		
		buttonDisconnect.on('click', (event) => {
			websocket.send(JSON.stringify({
				action: 'user.disconnect',
				user: user.id
			}));
		});

		usersElement.append(element);
	});
}

function setChannels(channels) {
	const channelsElement = $('#channels');
	channelsElement.empty();

	channels.forEach((channel, index) => {
		cachedChannels.push(channel);

		const element = $('<div class="channel"></div>');
		const channelUnread = $('<span class="channel-unread"></span>');
		const channelName = $('<a class="channel-name"></a>');
		if(index === 0) {
			element.addClass('channel-selected');
			channelName.addClass('channel-name-selected');

			changeChannel(channel.id);
		}
	
		channelName.text(`#${channel.name}`);
		channelName.on('click', (event) => {
			if(currentChannel !== channel.id) {
				$('.channel').removeClass('channel-selected');
				$('.channel-name').removeClass('channel-name-selected');

				element.addClass('channel-selected');
				channelName.addClass('channel-name-selected');

				changeChannel(channel.id);
			}
		});
	
		if([
			'lost-and-found'
		].includes(channel.name)) {
			element.append(channelUnread);
			channelName.addClass('channel-name-unread');
		}
		element.append(channelName);
	
		channelsElement.append(element);
	});
}

function handleMessage(data) {
	if(data.action === 'user.connect') {
		log.gateway(formatTime(data.time), `${data.content}`);
	}
	if(data.action === 'user.disconnect') {
		log.gateway(formatTime(data.time), `${data.content}`);
	}
	if(data.action === 'user.force_disconnect') {
		log.gateway(formatTime(data.time), `<a style="color: #ff9800;">${data.content}</a>`);
	}

	if(data.action === 'user.permissions_error') {
		log.gateway(formatTime(data.time), `<a class="message-error">${data.content}</a>`);
	}
	if(data.action === 'message.gateway') {
		const element = $('<div></div>');
		const elementBody = $('<div class="message-body"></div>');
		const elementTop = $('<div class="message-top"></div>');
		const elementBottom = $('<div class="message-bottom"></div>');
		
		const userAvatar = $('<img class="user-avatar">');
		const username = $('<a class="message-gateway-username"></a>');
		//const tagBot = $('<span class="tag-bot-verified"><svg class="mark-bot-verified" width="16" height="16" viewBox="0 0 16 15.2"><path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path></svg><a class="text-tag-bot">БОТ</a></div>');
		const tagBot = $('<span class="tag-bot-gateway"><svg class="mark-bot-verified" width="16" height="16" viewBox="0 0 16 15.2"><path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path></svg><a class="text-tag-bot">GATEWAY</a></div>');
		const time = $('<a class="message-time"></a>');
		const elementContent = $('<a class="message-content"></a>');
		
		userAvatar.prop('src', gatewayInfo.gateway_avatar);

		username.text(gatewayInfo.gateway_username);

		time.text(formatTime(data.time));

		elementContent.html(data.content);

		elementTop.append(username);
		elementTop.append(tagBot);
		elementTop.append(time);
		elementBottom.append(elementContent);

		elementBody.append(elementTop);
		elementBody.append(elementBottom);

		element.append(userAvatar);
		element.append(elementBody);

		_log(element.html());
	}

	if(data.action === 'message.user') {
		const element = $('<div></div>');
		const elementBody = $('<div class="message-body"></div>');
		const elementTop = $('<div class="message-top"></div>');
		const elementBottom = $('<div class="message-bottom"></div>');
		
		const userAvatar = $('<img class="user-avatar">');
		const username = $('<a class="user-username"></a>');
		const time = $('<a class="message-time"></a>');
		const elementContent = $('<a class="message-content"></a>');
		
		userAvatar.prop('src', data.user.avatar ? data.user.avatar.hash : '/images/avatars/default.png');

		username.text(data.user.username);

		time.text(formatTime(data.time));

		elementContent.html(data.content);

		elementTop.append(username);
		elementTop.append(time);
		elementBottom.append(elementContent);

		elementBody.append(elementTop);
		elementBody.append(elementBottom);

		element.append(userAvatar);
		element.append(elementBody);

		_log(element.html());
	}
}

function changeChannel(id) {
	currentChannel = id;

	const chat = $('#chat');
	chat.empty();

	const channel = cachedChannels.find((channel) => channel.id === id);
	const channelMessages = cachedMesages.filter((message) => {
		return message.channel.id === channel.id;
	});

	$('#text-channel-name').text(`#${channel.name}`);
	if(channel.topic) {
		$('#text-channel-topic').text(`${channel.topic}`);
		$('#channel-topic-divider').css('visibility', 'visible');
	} else {
		$('#text-channel-topic').text('');
		$('#channel-topic-divider').css('visibility', 'hidden');
	}

	$('#input-message-content').prop('placeholder', `Написать в #${channel.name}`);

	//log.local(luxon.DateTime.local().toFormat('HH:mm:ss'), `Установлен канал <b>#${channel.name}</b>`);

	channelMessages.forEach((message) => {
		handleMessage(message);
	});
}

function _log(html) {
	const chat = $('#chat');

	const element = $('<div class="message"></div>');

	element.html(html);

	chat.append(element);

	chat.animate({
		scrollTop: $('#chat').prop("scrollHeight")
	}, 0);
}

const log = {
	local: function local(time, text) {
		_log(`<a class="message-time">[${time}] </a><a class="message-type message-local">[Client]: </a><a class="message-content">${text}</a>`);
	},

	gateway: function gateway(time, text) {
		_log(`<a class="message-time">[${time}] </a><a class="message-type message-system">[Gateway]: </a><a class="message-content">${text}</a>`);
	},
	error: function error(time, text) {
		_log(`<a class="message-time">[${time}] </a><a class="message-type message-error">[Error]: </a><a class="message-error">${text}</a>`);
	},

	message: function message(time, text) {
		_log(`<a class="message-time">[${time}] </a><a class="message-type message-user">[Message]: </a><a class="message-user">${text}</a>`);
	}
};

function sendMessage(gateway) {
	if($('#input-message-content')[0].value.trim().length < 1) return;

	const content = $('#input-message-content')[0].value.trim().replace(/(script)|(onclick)/g, 'invalid');

	$('#input-message-content')[0].value = '';
	
	if(gateway) {
		websocket.send(JSON.stringify({
			action: 'message.send.gateway',
			channel: currentChannel,
			content: content
		}));
	} else {
		websocket.send(JSON.stringify({
			action: 'message.send',
			channel: currentChannel,
			content: content
		}));
	}
}

function formatTime(time) {
	return luxon.DateTime.fromSeconds(time).toFormat('HH:mm')
}

function connect(serverURL) {
	websocket = new WebSocket(serverURL);

	websocket.onopen = (event) => {
		log.gateway(luxon.DateTime.local().toFormat('HH:mm:ss'), 'Соединение с WebSocket сервером установлено');

		$('#input-server').prop('disabled', true);
		$('#button-server-connect').prop('disabled', true);
		$('#button-server-disconnect').prop('disabled', false);
	
		$('#input-content').prop('disabled', false);
	
		$('#button-send').prop('disabled', false);
		$('#button-send-gateway').prop('disabled', false);

		$('#users').empty();
	};
	websocket.onclose = (event) => {
		log.gateway(luxon.DateTime.local().toFormat('HH:mm:ss'), 'Соединение с WebSocket сервером разорвано');

		$('#input-server').prop('disabled', false);
		$('#button-server-connect').prop('disabled', false);
		$('#button-server-disconnect').prop('disabled', true);
	
		$('#input-content').prop('disabled', true);
	
		$('#button-send').prop('disabled', true);
		$('#button-send-gateway').prop('disabled', true);

		$('#channels').empty();
		$('#users').empty();
	};
	websocket.onmessage = (event) => {
		try {
			const data = JSON.parse(event.data);
			console.log(data);

			if(data.action === 'auth.login.request') {
				const element = $('#modal-auth-login');
				element.css('display', 'block');
			}
			if(data.action === 'auth.login.response') {
				const element = $('#modal-auth-login');
				if(data.success) {
					element.css('display', 'none');
				}
			}

			if(data.action === 'messages.list') {
				const messages = data.messages;
				messages.forEach((message) => {
					cachedMesages.push(message);

					if(message.channel.id === currentChannel) {
						handleMessage(message);
					}
				});
			}

			if(data.action === 'gateway.info') {
				const info = data.info;
				gatewayInfo = info;

				$('#text-guild-name').text(`${info.name} gateway`);

				$('#text-auth-gateway-name').text(info.name);

				$('#gateway-name').text(info.name);
				$('#gateway-version').text(info.version);

				$('#button-server-connect').text(info.button_gateway_connect);
				$('#button-server-disconnect').text(info.button_gateway_disconnect);

				$('#button-send').text(info.button_send_message);
				$('#button-send-gateway').text(info.button_send_message_gateway);
			}
			if(data.action === 'channels.list') {
				const channels = data.channels;
				setChannels(channels);
			}
			if(data.action === 'users.list') {
				const users = data.users;
				setUsers(users);
			}

			if(data.action.split('.')[0] === 'message') {
				cachedMesages.push(data);

				if(data.channel.id === currentChannel) {
					handleMessage(data);
				}
			}
		} catch(error) {
			log.error(luxon.DateTime.local().toFormat('HH:mm:ss'), error);
		}
	};
	websocket.onerror = (event) => {
		log.error(event.data);
	};
}

function disconnect() {
	$('#input-server').prop('disabled', false);
	$('#button-server-connect').prop('disabled', false);
	$('#button-server-disconnect').prop('disabled', true);

	$('#input-content').prop('disabled', true);

	$('#button-send').prop('disabled', true);
	$('#button-send-gateway').prop('disabled', true);

	websocket.close();
}

$(document).ready(() => {
	$('#input-server')[0].value = 'ws://assasans.ml:2012/websocket';
	$('#button-server-disconnect').prop('disabled', true);
	
	$('#input-content').prop('disabled', true);

	$('#button-send').prop('disabled', true);
	$('#button-send-gateway').prop('disabled', true);

	$('#button-server-connect').on('click', (event) => {
		$('#chat').empty();

		const serverURL = $('#input-server')[0].value;

		log.local(luxon.DateTime.local().toFormat('HH:mm:ss'), `Подключение к серверу <b>${serverURL}</b>...`);

		connect(serverURL);
	});

	$('#button-auth-login').on('click', (event) => {
		const userId = $('#input-auth-user')[0].value;
		websocket.send(JSON.stringify({
			action: 'auth.login',
			user: userId
		}));
	});

	$('#button-auth-cancel').on('click', (event) => {
		const element = $('#modal-auth-login');
		element.css('display', 'none');

		websocket.send(JSON.stringify({
			action: 'auth.login',
			user: null
		}));
	});

	$('#button-server-disconnect').on('click', (event) => {		
		disconnect();
	});
	
	$('#button-send').on('click', (event) => {
		sendMessage(false);
	});
	$(document).on('keypress', (event) => {
		if(event.which === 13) {
			sendMessage(false);
		}
	});

	$('#button-send-gateway').on('click', (event) => {
		sendMessage(true);
	});

	$('#button-chat-clear').on('click', (event) => {
		$('#chat').empty();
	});
});
