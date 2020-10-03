import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { articleCardViewModel } from 'src/models/viewModels/articleViewModel';
import { newsPageViewModel } from 'src/models/viewModels/newsPageViewModel';
import { ArticlesService } from 'src/services/articles.service';
import { SettingsService } from 'src/services/settings.service';

@Injectable()
export class newsResolver implements Resolve<newsPageViewModel> {
    constructor(private settingService:SettingsService,private articleService:ArticlesService, private router: Router) { }
    
    resolve(route: ActivatedRouteSnapshot): Observable<newsPageViewModel> {  
        return this.articleService.getAllNews().pipe(
            mergeMap((news:articleCardViewModel[])=>{
                return this.settingService.getNewsLimit().pipe(
                    map((pageLimit:number)=>{
                        const  model:newsPageViewModel = {news:news,newsPageLimit:pageLimit};
                        return model;
                    })
                )
            })
        );
      }  
}