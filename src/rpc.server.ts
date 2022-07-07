import http from "http";
import HTTPMethod from "./http.method";
import RPCMessage from "./rpc.message";
import RPCObjectCollection from "./rpc.object.collection";

export default class RPCServer {
    private objects: RPCObjectCollection;
    private port: number;

    constructor(port: number) {
        this.objects = new RPCObjectCollection();
        this.port = port;
    }

    provideObject(key: string, object: any): RPCServer {
        this.objects.push(key, object);
        return this;
    }

    provideFunction(
        key: string,
        name: string,
        fct: any,
        httpMethod?: HTTPMethod
    ): RPCServer {
        const object: any = {};
        object[name] = fct;
        this.objects.push(key, object, httpMethod);
        return this;
    }

    onGet(key: string, name: string, fct: any): RPCServer {
        this.provideFunction(key, name, fct, HTTPMethod.GET);
        return this;
    }

    onPost(key: string, name: string, fct: any): RPCServer {
        this.provideFunction(key, name, fct, HTTPMethod.POST);
        return this;
    }

    onPut(key: string, name: string, fct: any): RPCServer {
        this.provideFunction(key, name, fct, HTTPMethod.PUT);
        return this;
    }

    onPatch(key: string, name: string, fct: any): RPCServer {
        this.provideFunction(key, name, fct, HTTPMethod.PATCH);
        return this;
    }

    onDelete(key: string, name: string, fct: any): RPCServer {
        this.provideFunction(key, name, fct, HTTPMethod.DELETE);
        return this;
    }

    start() {
        const server = http.createServer(async (request, response) => {
            const message = new RPCMessage(request, response);
            const object = this.objects.getFromMessage(message);
            if (object && message.selector) {
                console.log(message.selector);
                const parameters = await message.readParameters();
                const result = object[message.selector](...parameters);
                if (result) {
                    message.replyWithObject(result);
                } else {
                    message.replyWithoutContent();
                }
            } else {
                message.rejectNoResource();
            }
        });
        server.listen(this.port);
        server.on("listening", () => {
            console.log(`RPC Server listening at ${this.port}`);
        });
        server.on("error", (error) => {
            console.error(
                `Error when starting RPC server on port ${this.port}`,
                error
            );
            server.close();
        });
    }
}
