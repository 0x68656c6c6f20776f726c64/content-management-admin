import { file } from '../schemas/file';

export class settingsViewModel{
    slides:file[];
    news_description:string;
    about_us_description:string;
    aboutUsBusinessCard:{
        name:string,
        title:string,
        description:string,
        image:string
    };
    companyInfo:
    {
        companyName:string,
        companyPhone:string,
        companyEmail:string,
        companyDescription:string,
        companyAddress:string,
        companyCity:string,
        companyCountry:string,
        companyPostalCode:string,
        companyLogo:string
    };
    newsPageLimit:number;
    caseDisplayRow:number;
}
