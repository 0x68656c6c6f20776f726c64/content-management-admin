import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { element } from 'protractor';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { httpReturn } from 'src/models/httpReturn';
import { articleCardViewModel } from 'src/models/viewModels/articleViewModel';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) { 
  }


  getAll()
  {
    return this.http.get<articleCardViewModel[]>(this.API_URL+'/articles');
  }

  getAllNews()
  {
    return this.http.get<articleCardViewModel[]>(this.API_URL+'/articles?category=news');
  }

  getAllCases()
  {
    return this.http.get<articleCardViewModel[]>(this.API_URL+'/articles?category=case');
  }

  updateArticleCards(modifiledArticleCards:articleCardViewModel[]):Observable<httpReturn>[]{
    var responseList:Observable<httpReturn>[] = [];
    for(let i=0;i<modifiledArticleCards.length;i++)
    {
      if(modifiledArticleCards[i].disabled)
      {
        responseList.push( this.http.post<httpReturn>(this.API_URL+'/articles/disable/'+modifiledArticleCards[i].articleId,{body:null}).pipe(share()));
      }
      else
      {
        responseList.push( this.http.post<httpReturn>(this.API_URL+'/articles/enable/'+modifiledArticleCards[i].articleId,{body:null}).pipe(share()));
      }
    }
    return responseList;
  }

  createArticle(param)
  {
    return this.http.post<httpReturn>(this.API_URL+'/articles/create',param);
  }

  deleteArticle(articleId:string)
  {
    return this.http.delete<httpReturn>(this.API_URL+'/articles/'+articleId);
  }

  // enableThisArticleWithId(ariticleId:string)
  // {
  //   this.articles.find(a=>a.articleId==ariticleId).disabled = false;
  //   this.saveArticles();
  // }

  // disableThisArticleWithId(ariticleId:string)
  // {
  //   this.articles.find(a=>a.articleId==ariticleId).disabled = true;
  //   this.saveArticles
  // }
}
