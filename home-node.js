"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var cross_fetch_1 = require("cross-fetch");
// import gql from 'graphql-tag';
// import { gql } from "apollo-boost";
var client_1 = require("@apollo/client");
var SET_STATE = client_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    mutation SetState($addr: String!,$value: String!) {\n        setState(addr: $addr, value: $value)\n    }\n"], ["\n    mutation SetState($addr: String!,$value: String!) {\n        setState(addr: $addr, value: $value)\n    }\n"
    // addr: "AgA=",
])));
// addr: "AgA=",
var uri = 'http://localhost:8080/graphql';
var link = new client_1.HttpLink({ uri: uri, fetch: cross_fetch_1["default"] });
var nodeInit = function (RED) {
    function HomeNode(config) {
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
    RED.nodes.registerType("home-node", HomeNode);
};
var templateObject_1;
module.exports = nodeInit;
