export default class Message {
    receiver: string;
    selector: string;
    parameters: any[];

    constructor(receiver: string, selector: string, parameters: any[] = []) {
        this.receiver = receiver;
        this.selector = selector;
        this.parameters = parameters;
    }
}
