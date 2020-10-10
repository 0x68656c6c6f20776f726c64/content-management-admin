import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { httpReturn } from 'src/models/httpReturn';
import { QuestionBase } from 'src/models/questions';
import { articleCardViewModel } from 'src/models/viewModels/articleViewModel';
import { casesPageViewModel } from 'src/models/viewModels/casesPageViewModel';
import { ArticlesService } from 'src/services/articles.service';
import { QuestionService } from 'src/services/question/question.service';
import { SettingsService } from 'src/services/settings.service';
import { CreateService } from '../modals/form-modal/form-modal.component';
import { ConfirmService } from '../modals/remove-confirm-modal/remove-confirm-modal.component';
import { ToastService } from '../toast/toast.component';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.css']
})
export class CasesComponent implements OnInit {

  loading = false;

  toast;

  caseRowForm:FormGroup;

  model:casesPageViewModel;

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
    this.model = this.route.snapshot.data.cases;
    this.model.cases.sort(this.sortArticles);
    this.caseRowForm = new FormGroup({
      caseRow:new FormControl(this.model.caseDisplayRow)
    })
  }

  addCases(){
    this.questionService.getCreateArticleQuestions().subscribe(
      (questions:QuestionBase<any>[])=>{
        this.createService.create({title:'Create New Case ',questions:questions}).then(
          (result:string)=>{
            this.loading = true;
            var createArticle = JSON.parse(result);
            createArticle.articleId = this.generateValidCaseId();
            createArticle.category = 'case';
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

  updateCases(){
      this.loading = true;
      var result:Observable<httpReturn>[] = this.articleService.updateArticleCards(this.model.cases);
      result.push(this.settingService.updateCaseDisplayRow(this.caseRowForm.controls['caseRow'].value));
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
            this.toastService.show('Success update cases',{classname:'bg-success text-light',delay:2000});
          }
        })
      })
  }

  disableCases(articleId:string){
    this.model.cases.find(c=>c.articleId==articleId).disabled = true;
  }

  enableCases(articleId:string){
    this.model.cases.find(c=>c.articleId==articleId).disabled = false;
  }

  deleteThisCase(articleId:string){
    this.loading = true;
    this.confirmService.confirm({ title:'Confirm deletion', message: 'Do you really want to delete '+articleId+' ?' }).then(
      () => {
        this.articleService.deleteArticle(articleId).subscribe((data:httpReturn)=>{
          if(data.message=='success')
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'success',message:'success delete case with id: '+articleId}));
            window.location.reload();
          }
          else
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed delete case with id: '+articleId+'\n Project '+data.message}));
            window.location.reload();
          }
        })
      },
      () => {
        this.loading = false;
      });
  }

  editCase(articleId:string){
    this.router.navigate(['admin/article-detail',articleId]);
  }

  getCoverImage(id:string)
  {
    return environment.API_URL+'/pictures/'+id;
  }

  private sortArticles(a:articleCardViewModel,b:articleCardViewModel)
  {
    if( a.articleId>=b.articleId) return 1;
     else  return -1;
  }

  private generateValidCaseId()
  {
    var number = parseInt(this.model.cases[this.model.cases.length-1].articleId.slice(4),10);
    return 'case'+(number+1);
  }

}
