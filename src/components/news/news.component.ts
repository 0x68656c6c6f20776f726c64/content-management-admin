import { Component, OnInit } from '@angular/core';
import { ArticlesService } from 'src/services/articles.service';
import { ActivatedRoute, Router } from '@angular/router';
import { newsPageViewModel } from 'src/models/viewModels/newsPageViewModel';
import { SettingsService } from 'src/services/settings.service';
import { ToastService } from '../toast/toast.component';
import { ConfirmService } from '../modals/remove-confirm-modal/remove-confirm-modal.component';
import { QuestionService } from 'src/services/question/question.service';
import { CreateService } from '../modals/form-modal/form-modal.component';
import { FormControl, FormGroup } from '@angular/forms';
import { articleCardViewModel } from 'src/models/viewModels/articleViewModel';
import { QuestionBase } from 'src/models/questions';
import { httpReturn } from 'src/models/httpReturn';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  loading = false;

  toast;

  model:newsPageViewModel

  newsLimit:FormGroup;

  constructor(private router:Router,private confirmService:ConfirmService,private questionService:QuestionService,private createService:CreateService,private route:ActivatedRoute,private settingService:SettingsService,private articleService:ArticlesService,private toastService:ToastService) { }

  ngOnInit(): void {
    this.toast = JSON.parse(localStorage.getItem('toast'));
    if(this.toast)
    {
      switch(this.toast.type)
      {
        case 'success': this.toastService.show(this.toast.message,{classname:'bg-success text-light',delay:2000});
                        break;
        case 'danger': this.toastService.show(this.toast.message,{ classname: 'bg-danger text-light', delay: 10000});
                        break;
      }
      localStorage.removeItem('toast');
    }
    this.model = this.route.snapshot.data.news;
    this.model.news.sort(this.sortArticles);
    this.newsLimit = new FormGroup({
      newsLimit:new FormControl(this.model.newsPageLimit)
    })
  }

  addNews(){
    this.questionService.getCreateArticleQuestions().subscribe(
      (questions:QuestionBase<any>[])=>{
        this.createService.create({title:'Create New News ',questions:questions}).then(
          (result:string)=>{
            this.loading = true;
            var createArticle = JSON.parse(result);
            createArticle.articleId = this.generateValidNewsId();
            createArticle.category = 'news';
            this.articleService.createArticle(createArticle).subscribe((data:httpReturn)=>{
              if(data.message=='success')
              {
                this.loading = false;
                localStorage.setItem('toast',JSON.stringify({type:'success',message:'success create article with id: '+createArticle.articleId}));
                window.location.reload();
              }
              else
              {
                this.loading = false;
                localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed create article with id: '+createArticle.articleId+'\n Article '+data.message}));
                window.location.reload();
              }
            });
          },
          () => {
            this.loading = false;
          });
        });
  }

  updateNews(){
    this.loading = true;
      var result:Observable<httpReturn>[] = this.articleService.updateArticleCards(this.model.news);
      result.push(this.settingService.updateCaseDisplayRow(this.newsLimit.controls['newsLimit'].value));
      var resultCountDown = result.length;
      result.forEach(element=>{
        element.subscribe((data:httpReturn)=>{
          if(data.message!='success')
          {
            this.toastService.show(data.message,{ classname: 'bg-danger text-light', delay: 10000});
          }
          resultCountDown--;
          if(resultCountDown==0)
          {
            this.loading = false;
            this.toastService.show('Success update news',{classname:'bg-success text-light',delay:2000});
          }
        })
      })
  }

  disableThisNews(articleId:string){
    this.model.news.find(c=>c.articleId==articleId).disabled = true;
  }

  enableThisNews(articleId:string){
    this.model.news.find(c=>c.articleId==articleId).disabled = false;
  }

  deleteThisNews(articleId:string){
    this.loading = true;
    this.confirmService.confirm({ title:'Confirm deletion', message: 'Do you really want to delete '+articleId+' ?' }).then(
      () => {
        this.articleService.deleteArticle(articleId).subscribe((data:httpReturn)=>{
          if(data.message=='success')
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'success',message:'success delete news with id: '+articleId}));
            window.location.reload();
          }
          else
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed delete news with id: '+articleId+'\n Project '+data.message}));
            window.location.reload();
          }
        })
      },
      () => {
        this.loading = false;
      });
  }

  editNews(articleId:string){
    this.router.navigate(['admin/article-detail',articleId]);
  }


  private sortArticles(a:articleCardViewModel,b:articleCardViewModel)
  {
    if( a.articleId>=b.articleId) return 1;
     else  return -1;
  }

  private generateValidNewsId()
  {
    var number = parseInt(this.model.news[this.model.news.length-1].articleId.slice(4),10);
    return 'news'+(number+1);
  }
}
