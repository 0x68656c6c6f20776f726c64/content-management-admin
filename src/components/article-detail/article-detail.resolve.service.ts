import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { articleViewModel } from 'src/models/viewModels/articleViewModel';
import { ArticlesService } from 'src/services/articles.service';

@Injectable()
export class articleDetailResolver implements Resolve<articleViewModel> {
    constructor(private articleService:ArticlesService, private router: Router) { }
    
    resolve(route: ActivatedRouteSnapshot): Observable<articleViewModel> {  
        return this.articleService.getArticleById(route.params.articleId)
      }  
}
