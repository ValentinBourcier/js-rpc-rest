import { IncomingMessage, ServerResponse } from "http";
import HTTPMethod from "./http.method";

export default class RPCMessage {
    private request: IncomingMessage;
    private response: ServerResponse;

    private _receiver: string | undefined;
    private _selector: string | undefined;
    private _httpMethod: HTTPMethod | undefined;

    constructor(request: IncomingMessage, response: ServerResponse) {
        this.request = request;
        this.response = response;

        if (this.request.url) {
            const resource = this.request.url.split("/").splice(1);
            this._receiver = resource[0];
            this._selector = resource[1];
        }

        if (this.request.method) {
            this._httpMethod = (HTTPMethod as any)[this.request.method];
        }
    }

    get receiver(): string | undefined {
        return this._receiver;
    }

    get selector(): string | undefined {
        return this._selector;
    }

    get httpMethod(): HTTPMethod | undefined {
        return this._httpMethod;
    }

    async readParameters(): Promise<any[]> {
        return new Promise<any[]>((resolve, reject) => {
            let data = "";
            this.request.on("data", (chunk) => {
                data += chunk;
            });
            this.request.on("end", () => {
                if (this.request.complete) {
                    resolve(data.length > 0 ? JSON.parse(data) : []);
                } else {
                    reject(
                        "The connection was terminated before the full transmission of the message"
                    );
                }
            });
        });
    }

    replyWithObject(object: any): void {
        this.response.setHeader("Content-Type", "application/json");
        this.response.writeHead(200);
        this.response.end(JSON.stringify(object));
    }

    replyWithoutContent(): void {
        this.response.writeHead(204).end();
    }

    rejectNoResource(): void {
        this.response.writeHead(404).end();
    }
}
