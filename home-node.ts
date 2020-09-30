import fetch from 'cross-fetch';
import { HttpLink, execute, gql } from "@apollo/client";
import { Node, NodeDef, NodeInitializer } from "node-red";

const SET_STATE = gql`
    mutation SetState($addr: String!,$value: String!) {
        setState(addr: $addr, value: $value)
    }
`
const uri = 'http://localhost:8080/graphql';
const link = new HttpLink({ uri, fetch: fetch });

interface HomeNodeDef extends NodeDef { addr: String, value: String }

const nodeInit: NodeInitializer = (RED): void => {
    function HomeNode(this: Node, config: HomeNodeDef) {
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

    RED.nodes.registerType("home-node", HomeNode);
}
export = nodeInit