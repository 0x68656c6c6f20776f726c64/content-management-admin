export class submission{
    submissionId: string;
    name:string;
    relatedTitle: string;
    submitTime: Date;
    status: string;
    content:[
        {
            key:String,
            value:String
        }
    ]
}