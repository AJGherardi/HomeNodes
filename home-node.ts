import fetch from 'cross-fetch';
import { HttpLink, execute, gql } from "@apollo/client";
import { Node, NodeDef, NodeInitializer } from "node-red";

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

const uri = 'http://localhost:8080/graphql';
const link = new HttpLink({ uri, fetch: fetch });

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

    RED.nodes.registerType("set-state", SetStateNode);
    RED.nodes.registerType("scene-recall", SceneRecallNode);
}
export = nodeInit