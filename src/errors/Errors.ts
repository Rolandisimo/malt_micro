export class RequestParamValidate extends Error {
    public readonly status = 400;
    public message;

    constructor(message) {
        super();
        this.message = message;
    }
}
