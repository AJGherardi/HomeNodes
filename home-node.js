"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var client_1 = require("@apollo/client");
var ws_1 = require("@apollo/client/link/ws");
// import { WebSocket } from "ws";
var WebSocket = require("ws");
var SET_STATE = client_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    mutation SetState($addr: String!,$value: String!) {\n        setState(addr: $addr, value: $value)\n    }\n"], ["\n    mutation SetState($addr: String!,$value: String!) {\n        setState(addr: $addr, value: $value)\n    }\n"])));
var SCENE_RECALL = client_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    mutation SceneRecall($addr: String!, $sceneNumber: String!) {\n        sceneRecall(addr: $addr, sceneNumber: $sceneNumber) \n    }\n"], ["\n    mutation SceneRecall($addr: String!, $sceneNumber: String!) {\n        sceneRecall(addr: $addr, sceneNumber: $sceneNumber) \n    }\n"])));
var GET_EVENTS = client_1.gql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n    subscription GetEvents {\n        getEvents\n    }\n"], ["\n    subscription GetEvents {\n        getEvents\n    }\n"])));
var uri = 'ws://localhost:8080/graphql';
var link = new ws_1.WebSocketLink({
    uri: uri,
    options: {
        connectionParams: { "webKey": "hOKv/t/RS1TWwWEIeheP1A==" }
    },
    webSocketImpl: WebSocket
});
var nodeInit = function (RED) {
    function SceneRecallNode(config) {
        RED.nodes.createNode(this, config);
        var operation = {
            query: SCENE_RECALL,
            variables: {
                addr: config.addr,
                sceneNumber: config.sceneNumber
            }
        };
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
        client_1.execute(link, operation).subscribe({
            next: function (data) {
                var msg = { payload: "" };
                msg.payload = data;
                _this.send(msg);
                // done();
            },
            complete: function () { return console.log("complete"); }
        });
    }
    RED.nodes.registerType("set-state", SetStateNode);
    RED.nodes.registerType("scene-recall", SceneRecallNode);
    RED.nodes.registerType("get-events", GetEventsNode);
};
var templateObject_1, templateObject_2, templateObject_3;
module.exports = nodeInit;
