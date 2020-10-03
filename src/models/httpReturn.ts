export class httpReturn{
    message:string

    constructor(options:{message?:string}={})
    {
        this.message = options.message;
    }
}