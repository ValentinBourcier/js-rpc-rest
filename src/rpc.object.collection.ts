import HTTPMethod from "./http.method";
import RPCMessage from "./rpc.message";

export default class RPCObjectCollection {
    private objects: any;

    constructor() {
        this.objects = {};
    }

    push(
        name: string,
        object: any,
        httpMethod: HTTPMethod = HTTPMethod.POST
    ): void {
        this.objects[name] = {
            object: object,
            httpMethod: httpMethod
        };
    }

    get(name?: string): any | undefined {
        if (name) {
            return this.objects[name];
        }
        return undefined;
    }

    getFromMessage(message: RPCMessage): any | undefined {
        let object = undefined;
        if (message.receiver) {
            const rpcObject = this.get(message.receiver);
            if (rpcObject && rpcObject.httpMethod == message.httpMethod) {
                object = rpcObject.object;
            }
        }
        return object;
    }
}
