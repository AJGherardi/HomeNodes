import { execute, gql } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { Node, NodeDef, NodeInitializer } from "node-red";
import WebSocket = require("ws")

const SET_STATE = gql`
    mutation SetState($addr: String!,$value: String!) {
        setState(addr: $addr, value: $value)
    }
`

const SCENE_RECALL = gql`
    mutation SceneRecall($addr: String!, $sceneNumber: String!) {
        sceneRecall(addr: $addr, sceneNumber: $sceneNumber) 
    }
`

const GET_EVENTS = gql`
    subscription GetEvents {
        getEvents
    }
`

const link = new WebSocketLink({
    uri: 'ws://localhost:8080/graphql',
    options: {
        connectionParams: { "webKey": "hOKv/t/RS1TWwWEIeheP1A==" }
    },
    webSocketImpl: WebSocket
});

interface SetStateNodeDef extends NodeDef { addr: String, value: String }
interface SceneRecallNodeDef extends NodeDef { addr: String, sceneNumber: String }

const nodeInit: NodeInitializer = (RED): void => {
    function SceneRecallNode(this: Node, config: SceneRecallNodeDef) {
        RED.nodes.createNode(this, config);
        const operation = {
            query: SCENE_RECALL,
            variables: {
                addr: config.addr,
                sceneNumber: config.sceneNumber
            },
        };

        this.on("input", (msg, send, done) => {
            execute(link, operation).subscribe({
                next: data => {
                    msg.payload = data
                    send(msg)
                    done();
                },
                complete: () => console.log(`complete`),
            })
        });
    }

    function SetStateNode(this: Node, config: SetStateNodeDef) {
        RED.nodes.createNode(this, config);
        const operation = {
            query: SET_STATE,
            variables: {
                addr: config.addr,
                value: config.value
            },
        };

        this.on("input", (msg, send, done) => {
            execute(link, operation).subscribe({
                next: data => {
                    msg.payload = data
                    send(msg)
                    done();
                },
                complete: () => console.log(`complete`),
            })
        });
    }

    function GetEventsNode(this: Node, config: SceneRecallNodeDef) {
        RED.nodes.createNode(this, config);
        const operation = {
            query: GET_EVENTS,
        };

        execute(link, operation).subscribe({
            next: data => {
                var msg = { payload: "" };
                msg.payload = data
                this.send(msg)
            },
            complete: () => console.log(`complete`),
        })
    }

    RED.nodes.registerType("set-state", SetStateNode);
    RED.nodes.registerType("scene-recall", SceneRecallNode);
    RED.nodes.registerType("get-events", GetEventsNode);
}
export = nodeInit