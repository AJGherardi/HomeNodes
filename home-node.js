"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var client_1 = require("@apollo/client");
var ws_1 = require("@apollo/client/link/ws");
var AppWebSocket = require("./websocket");
var SET_STATE = client_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    mutation SetState($addr: String!,$value: String!) {\n        setState(addr: $addr, value: $value)\n    }\n"], ["\n    mutation SetState($addr: String!,$value: String!) {\n        setState(addr: $addr, value: $value)\n    }\n"])));
var SCENE_RECALL = client_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    mutation SceneRecall($addr: String!, $sceneNumber: String!) {\n        sceneRecall(addr: $addr, sceneNumber: $sceneNumber) \n    }\n"], ["\n    mutation SceneRecall($addr: String!, $sceneNumber: String!) {\n        sceneRecall(addr: $addr, sceneNumber: $sceneNumber) \n    }\n"])));
var GET_EVENTS = client_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    subscription GetEvents {\n        getEvents\n    }\n"], ["\n    subscription GetEvents {\n        getEvents\n    }\n"])));
var nodeInit = function (RED) {
    function HubConfigNode(config) {
        RED.nodes.createNode(this, config);
        this.context().set("link", new ws_1.WebSocketLink({
            uri: config.uri,
            options: {
                connectionParams: { "webKey": config.webKey },
                reconnect: true
            },
            webSocketImpl: AppWebSocket
        }));
    }
    function SceneRecallNode(config) {
        RED.nodes.createNode(this, config);
        var operation = {
            query: SCENE_RECALL,
            variables: {
                addr: config.addr,
                sceneNumber: config.sceneNumber
            }
        };
        var link = RED.nodes.getNode(config.server).context().get("link");
        this.on("input", function (msg, send, done) {
            client_1.execute(link, operation).subscribe({
                next: function (data) {
                    msg.payload = data;
                    send(msg);
                    done();
                },
                complete: function () { return console.log("complete"); }
            });
        });
    }
    function SetStateNode(config) {
        RED.nodes.createNode(this, config);
        var operation = {
            query: SET_STATE,
            variables: {
                addr: config.addr,
                value: config.value
            }
        };
        var link = RED.nodes.getNode(config.server).context().get("link");
        this.on("input", function (msg, send, done) {
            client_1.execute(link, operation).subscribe({
                next: function (data) {
                    msg.payload = data;
                    send(msg);
                    done();
                },
                complete: function () { return console.log("complete"); }
            });
        });
    }
    function GetEventsNode(config) {
        var _this = this;
        RED.nodes.createNode(this, config);
        var operation = {
            query: GET_EVENTS
        };
        var link = RED.nodes.getNode(config.server).context().get("link");
        client_1.execute(link, operation).subscribe({
            next: function (data) {
                var msg = { payload: "" };
                msg.payload = data;
                _this.send(msg);
            },
            complete: function () { return console.log("complete"); }
        });
    }
    RED.nodes.registerType("hub-config", HubConfigNode);
    RED.nodes.registerType("set-state", SetStateNode);
    RED.nodes.registerType("scene-recall", SceneRecallNode);
    RED.nodes.registerType("get-events", GetEventsNode);
};
var templateObject_1, templateObject_2, templateObject_3;
module.exports = nodeInit;
