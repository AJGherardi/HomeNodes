"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var cross_fetch_1 = require("cross-fetch");
var client_1 = require("@apollo/client");
var SET_STATE = client_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    mutation SetState($addr: String!,$value: String!) {\n        setState(addr: $addr, value: $value)\n    }\n"], ["\n    mutation SetState($addr: String!,$value: String!) {\n        setState(addr: $addr, value: $value)\n    }\n"])));
var SCENE_RECALL = client_1.gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    mutation SceneRecall($addr: String!, $sceneNumber: String!) {\n        sceneRecall(addr: $addr, sceneNumber: $sceneNumber) \n    }\n"], ["\n    mutation SceneRecall($addr: String!, $sceneNumber: String!) {\n        sceneRecall(addr: $addr, sceneNumber: $sceneNumber) \n    }\n"])));
var uri = 'http://localhost:8080/graphql';
var link = new client_1.HttpLink({ uri: uri, fetch: cross_fetch_1["default"] });
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
                    // msg.payload = data
                    // send(msg)
                }
            });
            done();
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
    RED.nodes.registerType("set-state", SetStateNode);
    RED.nodes.registerType("scene-recall", SceneRecallNode);
};
var templateObject_1, templateObject_2;
module.exports = nodeInit;
