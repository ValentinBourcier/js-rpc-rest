import RPCClient from "./rpc.client.js";

const client = new RPCClient("http://localhost:8080");

const user = client.requireObject("user", [
    "subscribe",
    "setLastname",
    "lastname"
]);
async function test() {
    let name = await user.lastname();
    await user.subscribe("Valentin", "Doe");
    name = await user.lastname();
}
test();
