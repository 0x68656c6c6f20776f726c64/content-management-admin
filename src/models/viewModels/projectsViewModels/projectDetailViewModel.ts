
export class projectDetailViewModel{
    projectId: string
    title: string
    subtitle: string
    category: string
    hot:boolean
    disabled: boolean
    image:string
    description:string
    content:string
    projectFlow:[
        {
            title:string,
            content:string
        }
    ]
    projectRequirement:string
    projectFee:[
        {
            title:string,
            amount:number
        }
    ]
}