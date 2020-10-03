import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectsService } from 'src/services/projects.service';
import { Router, ActivatedRoute } from '@angular/router';
import { projectCardViewModel } from 'src/models/viewModels/projectsViewModels/projectCardViewModel';
import { project_categoryViewModel } from 'src/models/viewModels/projectsViewModels/project_categoryViewModel';
import { Observable, observable } from 'rxjs';
import { httpReturn } from 'src/models/httpReturn';
import { ConfirmService } from '../modals/remove-confirm-modal/remove-confirm-modal.component';
import { ToastService } from '../toast/toast.component';
import { CreateService } from '../modals/form-modal/form-modal.component';
import { QuestionService } from 'src/services/question/question.service';
import { QuestionBase } from 'src/models/questions';
import { projectCreate } from 'src/models/viewModels/projectsViewModels/projectCreateModel';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  loading = false;

  toast;

  selected:project_categoryViewModel;

  allProjects:projectCardViewModel[];

  categories:project_categoryViewModel[];

  displayProjects:projectCardViewModel[];

  modifiedProject:projectCardViewModel[]=[];

  constructor(private questionService:QuestionService,private createService:CreateService, private toastService:ToastService, private confirmService:ConfirmService, private router:Router, private projectService:ProjectsService,private route: ActivatedRoute  ) {
   }

  ngOnInit():void{
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
    this.allProjects = this.route.snapshot.data.projects.sort(this.sortProjects);
    this.displayProjects = this.allProjects;

    this.categories = this.route.snapshot.data.projects_categories;

    this.categories.push({key:"Hot",title:"热门项目"});

    this.selected = {key:"All",title:"所有项目"};

  }

  addNewCategory(){
    this.questionService.getCreateProjectCategoryForm().subscribe((result:QuestionBase<any>[])=>{
      this.createService.create({title:"Create new category",questions:result}).then(
        (result:string)=>{
          this.loading = true;
          var createProject:project_categoryViewModel =  JSON.parse(result);
          this.projectService.createProjectCategory(createProject).subscribe((data:httpReturn)=>{
            if(data.message=='success')
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'success',message:'success create project category with key: '+createProject.key}));
              window.location.reload();
            }
            else
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed create project with key: '+createProject.key+'\n Error: '+data.message}));
              window.location.reload();
            }
          })
        },
        () => {

        }
      )
    })
  }

  RemoveThisCategory(){
    this.loading = true;
    this.confirmService.confirm({ title:'Confirm deletion', message: 'Do you really want to delete '+this.selected.title+' category ?' }).then(
      () => {
        this.projectService.deleteCategoryWithKey(this.selected.key).subscribe((data:httpReturn)=>{
          if(data.message=='success')
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'success',message:'success delete category with key: '+this.selected.key}));
            window.location.reload();
          }
          else
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed delete category with key: '+this.selected.key+'\n Project '+data.message}));
            window.location.reload();
          }
        })
      },
      () => {
        this.loading = false;
      });
  }

  editThisCategory(){
    this.questionService.getCategoryUpdateForm(this.selected.title).subscribe((result:QuestionBase<any>[])=>{
      this.createService.create({title:'Update Category: ['+ this.selected.key+'] ',questions:result}).then(
        (res:string)=>{
          this.loading = true;
          var data:project_categoryViewModel = new project_categoryViewModel();
          data.key = this.selected.key;
          data.title = (JSON.parse(res)).title;
          console.log(data);
          this.projectService.updateProjectCategory(data).subscribe((data:httpReturn)=>{
            if(data.message=='success')
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'success',message:'success update category with key: '+this.selected.key}));
              window.location.reload();
            }
            else
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed update category with key: '+this.selected.key+'\n Error: '+data.message}));
              window.location.reload();
            }
          })
        },
        ()=>{
          this.loading = false;
        }
      )
    })
  }

  addProject(cat:string){
    this.questionService.getCreateProjectQuestions().subscribe((result:QuestionBase<any>[])=>{
      this.createService.create({title:'Create new project',questions:result }).then(
        (result:string)=>{
          this.loading = true;
          var rawData = JSON.parse(result);
          if(rawData.hot=='true')
          {
            rawData.hot = true;
          }
          else
          {
            rawData.hot = false;
          }
          var createProject:projectCreate = rawData;
          createProject.projectId = this.generateValidProjectId();
          createProject.category = cat;
          this.projectService.createProject(createProject).subscribe((data:httpReturn)=>{
            if(data.message=='success')
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'success',message:'success create project with id: '+createProject.projectId}));
              window.location.reload();
            }
            else
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed create project with id: '+createProject.projectId+'\n Project '+data.message}));
              window.location.reload();
            }
          });
        },
        () => {
          this.loading = false;
        }
      );
    });
  }

  selectThis(cat:project_categoryViewModel)
  {
    if(cat.key=='Hot')
    {
      this.displayProjects = this.allProjects.filter(element=>element.hot);
    }
    else if(cat.key=='All')
    {
      this.displayProjects = this.allProjects
    }
    else
    {
      this.displayProjects = this.allProjects.filter(element=>element.category==cat.key);
    }
    this.categories.push(this.selected);
    this.selected = cat;
    this.categories = this.categories.filter(c=>c.key !== cat.key);
    this.categories.sort();
  }

  disableThisProject(projectId:string)
  {
    this.allProjects.find(p=>p.projectId==projectId).disabled = true;
    if(this.modifiedProject.find(p=>p.projectId==projectId))
    {
      this.modifiedProject.find(p=>p.projectId==projectId).disabled = true;
    }
    else
    {
      this.modifiedProject.push(this.allProjects.find(p=>p.projectId==projectId));
    }
  }
  enableThisProject(projectId:string)
  {
    this.allProjects.find(p=>p.projectId==projectId).disabled = false;
    if(this.modifiedProject.find(p=>p.projectId==projectId))
    {
      this.modifiedProject.find(p=>p.projectId==projectId).disabled = false;
    }
    else
    {
      this.modifiedProject.push(this.allProjects.find(p=>p.projectId==projectId));
    }
  }

  updateProjects(){
    if(this.modifiedProject.length<1) return;
    this.loading = true;
    var result:Observable<httpReturn>[] = this.projectService.updateProjectCards(this.modifiedProject);
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
          this.toastService.show('Success update prjects',{classname:'bg-success text-light',delay:2000});
        }
      })
    })

  }

  openRemoveConfirmModal(pid:string){
    this.loading = true;
      this.confirmService.confirm({ title:'Confirm deletion', message: 'Do you really want to delete '+pid+' ?' }).then(
        () => {
          this.projectService.deleteProjectWithId(pid).subscribe((data:httpReturn)=>{
            if(data.message=='success')
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'success',message:'success delete project with id: '+pid}));
              window.location.reload();
            }
            else
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed delete project with id: '+pid+'\n Project '+data.message}));
              window.location.reload();
            }
          })
        },
        () => {
          this.loading = false;
        });
  }


  editThisProject(pId:string)
  {
    this.router.navigate(['admin/project-detail',pId]);
  }

  showRemoveCat()
  {
    return !(this.displayProjects.length>0)
  }

  private sortProjects(a:projectCardViewModel,b:projectCardViewModel)
  {
    if( a.projectId>=b.projectId) return 1;
     else  return -1;
  }

  private generateValidProjectId()
  {
    var lastProjectId = this.allProjects[this.allProjects.length-1].projectId;
    var number = parseInt(lastProjectId.slice(7),10);
    console.log(number);
    return 'project'+(number+1);
  }

}
