
# Дурка!chat

WebSocket chat written in TypeScript

## Features

- MySQL integration (users, channels, messages)
- Users
  - User list
  - User tags
    - Bot (normal)
    - Bot (verified)
    - Gateway
	- [WIP] Users authentication
- Channels
	- Channel list
- Messages
	- [WIP] Unread messages
- [WIP] Bot API

## Installation

1. Clone this repository (`git clone https://github.com/Assasans/durka-chat.git`)
2. Install dependencies (`npm install`)
3. Build TypeScript (`npm run build`)
4. Copy `config.example.json` to `config.json` and fill your MySQL auth information
5. Import SQL database structure from file `structure.sql`

## Running

1. Execute `npm run start`
