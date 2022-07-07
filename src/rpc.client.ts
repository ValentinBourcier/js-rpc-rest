import HTTPMethod from "./http.method";

export default class RPCClient {
    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    requireObject(key: string, methods: string[]): any {
        const object: any = {};
        for (const method of methods) {
            object[method] = this.requireFunction(key, method);
        }
        return object;
    }

    requireFunction(
        key: string,
        name: string,
        httpMethod: HTTPMethod = HTTPMethod.POST
    ): (...parameters: any[]) => Promise<any | undefined> {
        return async (...parameters: any[]): Promise<any | undefined> => {
            const uri = `${this.endpoint}/${key}/${name}`;
            const request: any = {};
            request.method = httpMethod;
            if (parameters.length > 0) {
                request.headers = {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                };
                request.body = JSON.stringify(parameters);
            }

            const response = await fetch(uri, request);

            if (response.status == 404) throw `Undefined ${key}.${name}`;
            if (response.status == 200) {
                return await response.json();
            }
        };
    }
}
