import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { articleCardViewModel } from 'src/models/viewModels/articleViewModel';
import { casesPageViewModel } from 'src/models/viewModels/casesPageViewModel';
import { ArticlesService } from 'src/services/articles.service';
import { SettingsService } from 'src/services/settings.service';

@Injectable()
export class caseResolver implements Resolve<casesPageViewModel> {
    constructor(private articleService:ArticlesService, private settingService:SettingsService, private router: Router) { }
    
    resolve(route: ActivatedRouteSnapshot): Observable<casesPageViewModel> {  
        return this.articleService.getAllCases().pipe(
            mergeMap((cases:articleCardViewModel[])=>{
                return this.settingService.getCaseDisplayRow().pipe(
                    map((rowNum:number)=>{
                        const  model:casesPageViewModel = {cases:cases,caseDisplayRow:rowNum};
                        return model;
                    })
                )
            })
        );
      }  
}