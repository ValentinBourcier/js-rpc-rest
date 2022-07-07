import RPCServer from "./rpc.server.js";

const server = new RPCServer(8080);

class User {
    firstname?: string = "John";
    _lastname: string = "Doe";

    lastname(): string {
        return this._lastname;
    }

    subscribe(firstname: string, lastname: string): string {
        console.log(firstname + " " + lastname);
        this.firstname = firstname;
        this._lastname = lastname;

        return `Hello ${firstname} ${lastname} ! `;
    }

    setLastname(lastname: string): void {
        this._lastname = lastname;
    }
}

server.provideObject("user", new User());

server.start();
