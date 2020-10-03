export class settings{
    slides:string[];
    news_description:string;
    about_us_description:string;
    aboutUsBusinessCard:{
        name:string;
        title:string;
        description:string;
        image:string;
    }
    companyInfo:companyInfo;
    newsPageLimit:number;
    caseDisplayRow:number;
}

export class companyInfo{
    companyName:string;
    companyPhone:string;
    companyEmail:string;
    companyDescription:string;
    companyAddress:string;
    companyCity:string;
    companyCountry:string;
    companyPostalCode:string;
    companyLogo:string;
}