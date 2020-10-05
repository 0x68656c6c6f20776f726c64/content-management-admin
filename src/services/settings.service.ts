import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { newsAndAboutUsDescription } from 'src/models/helpers/newsAndAboutUSDescription';
import { httpReturn } from 'src/models/httpReturn';
import { file } from 'src/models/schemas/file';
import { companyInfo, settings } from 'src/models/schemas/settings';
import { settingsViewModel } from 'src/models/viewModels/settingsViewModel';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getSettings():Observable<settings>{
    return this.http.get<settings>(this.API_URL+'/settings/');
  }

  updateSettings(param):Observable<httpReturn>{
    return this.http.put<httpReturn>(this.API_URL+'/settings/update',param);
  }

  updateSlides(newSlides:string[]):Observable<httpReturn>{
    return this.http.get<settings>(this.API_URL+'/settings/').pipe(
      mergeMap(setting=>{
        setting.slides=newSlides;
        return this.http.put<httpReturn>(this.API_URL+'/settings/update',setting)
      })
    )
  }

  updateDescription(param:newsAndAboutUsDescription):Observable<httpReturn>{
    return this.http.get<settings>(this.API_URL+'/settings/').pipe(
      mergeMap(setting=>{
        setting.news_description = param.news_descritpion;
        setting.about_us_description = param.about_us_description;
        return this.http.put<httpReturn>(this.API_URL+'/settings/update',setting)
      })
    )
  }

  updateCompanyInfo(param:companyInfo){
    return this.http.get<settings>(this.API_URL+'/settings/').pipe(
      mergeMap(setting=>{
        setting.companyInfo = param;
        return this.http.put<httpReturn>(this.API_URL+'/settings/update',setting)
      })
    )
  }

  getCaseDisplayRow():Observable<number>{
    return this.http.get<settings>(this.API_URL+'/settings/').pipe(
      map(res=>{return res.caseDisplayRow})
    )
  }

  getNewsLimit():Observable<number>{
    return this.http.get<settings>(this.API_URL+'/settings/').pipe(
      map(res=>{return res.newsPageLimit})
    )
  }

  updateCaseDisplayRow(displayRow:number):Observable<httpReturn>{
    return this.http.get<settings>(this.API_URL+'/settings/').pipe(
      mergeMap(setting=>{
        setting.caseDisplayRow = displayRow
        return this.http.put<httpReturn>(this.API_URL+'/settings/update',setting)
      })
    )
  }

  updateNewsLimit(newsLimit:number):Observable<httpReturn>{
    return this.http.get<settings>(this.API_URL+'/settings/').pipe(
      mergeMap(setting=>{
        setting.newsPageLimit = newsLimit;
        return this.http.put<httpReturn>(this.API_URL+'/settings/update',setting)
      })
    )
  }

  getPrivateKey():Observable<string>{
    return this.http.get<string>(this.API_URL+'/settings/private_key')
  }

  updatePrivateKey(newKey):Observable<httpReturn>{
    return this.http.post<httpReturn>(this.API_URL+'/settings/',newKey);
  }
}
