const WebSocket = require("ws");

class AppWebSocket extends WebSocket {
    constructor(address, protocols) {
       super(address, protocols, {rejectUnauthorized: false});
    }
}

module.exports = AppWebSocket