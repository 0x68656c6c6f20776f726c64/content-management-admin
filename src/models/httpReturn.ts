export class httpReturn{
    message:string

    constructor(options:{message?:string}={})
    {
        this.message = options.message;
    }
}

export class fileReturn{
    result: {
        message:string
    }
    fileParam: {
        fieldname: string,
        originalname: string,
        encoding: string,
        mimetype: string,
        destination: string,
        filename: string,
        path: string,
        size: number,
        fileId: string,
    }

    constructor(message:string)
    {
        this.result.message = message;
        this.fileParam=null;
    }
}