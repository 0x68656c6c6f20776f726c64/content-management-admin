import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProjectsService } from 'src/services/projects.service';
import * as CKSource from './../../ckeditor/build/cksource';
import { ActivatedRoute } from '@angular/router';
import { projectDetailViewModel } from 'src/models/viewModels/projectsViewModels/projectDetailViewModel';
import { ImageUploadMessage } from 'src/models/helpers/ImageUploadMessage';
import { environment } from 'src/environments/environment';
import { QuestionService } from 'src/services/question/question.service';
import { QuestionBase } from 'src/models/questions';
import { CreateService } from '../modals/form-modal/form-modal.component';
import { projectDetailEditorConfig } from 'src/models/helpers/editorConfig';
import { ImageService } from 'src/services/image.service';
import { fileReturn, httpReturn } from 'src/models/httpReturn';
import { ToastService } from '../toast/toast.component';

const ClassicEditor = CKSource.ClassicEditor;
const CKFinder = CKSource.CKFinder;

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements AfterViewInit {

  public editorConfig:projectDetailEditorConfig;

  private API_URL = environment.API_URL;

  public projectDetail=ClassicEditor;
  public projectRequirement = ClassicEditor;

  public projectFlow = []
  
  public model:projectDetailViewModel;

  coverImage:ImageUploadMessage;

  public loading = false;

  constructor(private toastService:ToastService,private imageService:ImageService,private createService:CreateService,private questionService:QuestionService,private route:ActivatedRoute, private projectService:ProjectsService) { }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.model = this.route.snapshot.data.project;
    this.editorConfig={
      projectDetail:{
        ckfinder:{
          uploadUrl:environment.API_URL+'/pictures/content-image-upload?id='+this.model.projectId+'&field=detail',
          options: {
            resourceType: 'Images'
          }
        }
      },
      projectRequirement:{
        ckfinder:{
          uploadUrl:environment.API_URL+'/pictures/content-image-upload?id='+this.model.projectId+'&field=requirement',
          options: {
            resourceType: 'Images'
          }
        }
      },
      projectFlow:[]
    }
    var count=0;
    this.model.projectFlow.forEach(element => {
        var newEditor = ClassicEditor
        this.projectFlow.push(newEditor);
        this.editorConfig.projectFlow.push(
          {
            ckfinder:{
              uploadUrl:environment.API_URL+'/pictures/content-image-upload?id='+this.model.projectId+'&field=flow'+count,
              options: {
                resourceType: 'Images'
              }
            }
          }
        )
        count++;
    });
    this.coverImage = {id:this.model.projectId+'-cover',content:null,status:'normal'};
    // this.projectDetail = ClassicEditor.create(
    //   {
    //     plugins: [CKFinder],
    //     ckfinder:{
    //       uploadUrl:this.API_URL+'/pictures/content-image-upload?projectId='+this.model.projectId+'&field=detail',

    //       options: {
    //         resourceType: 'project-Image'
    //     }
    //   }
        // simpleUpload:{
        //   uploadUrl:this.API_URL+'/pictures/project-upload?projectId='+this.model.projectId+'&field=detail',
        //   withCredentials:true,
        //   headers:{
        //     Authorization: 'Bearer '+localStorage.getItem('token')
        //   }
        // }
      // });
  
    // this.route.params.subscribe(params=>{
    //   this.model = this.projectService.getProjectWithId(params['projectId']);
    //   this.model.projectFlow.forEach(element => {
    //     var newEditor = ClassicEditor;
    //     this.projectFlow.push(newEditor);
    //   });
    // });
  }

  onSubmit(){
    this.loading=true;
    if(this.coverImage.status!='normal')
    {
      this.imageService.uploadImage(this.coverImage).subscribe(
        (imageUpload:fileReturn)=>{
          if(imageUpload.result.message=='success')
          {
            this.coverImage.status = 'success';
            this.model.image = this.coverImage.id;
            this.projectService.updateProjectsWithId(this.model).subscribe(
              (result:httpReturn)=>{
                if(result.message=='success')
                {
                  this.loading = false;
                  this.toastService.show('success update project: '+this.model.projectId,{classname:'bg-success text-light',delay:2000});
                }
                else
                {
                  this.loading = false;
                  this.toastService.show('failed update project: '+this.model.projectId+'\n Project '+result.message,{classname:'bg-danger text-light',delay:2000});
                }
              }
            )
          }
          else
          {
            this.loading = false;
            this.coverImage.status = 'fail';
            this.toastService.show('failed update cover image: '+this.model.projectId+'\n Image '+imageUpload.result.message,{classname:'bg-danger text-light',delay:2000});
          }
        }
      )
    }
    else
    {
      this.projectService.updateProjectsWithId(this.model).subscribe(
        (result:httpReturn)=>{
          if(result.message=='success')
          {
            this.loading = false;
            this.toastService.show('success update project: '+this.model.projectId,{classname:'bg-success text-light',delay:2000});
          }
          else
          {
            this.loading = false;
            this.toastService.show('failed update project: '+this.model.projectId+'\n projectId '+result.message,{classname:'bg-danger text-light',delay:2000});
          }
        }
      )
    }   
  }

  editThisItem(index:number){
    this.questionService.getEditProjectFeeQuestions(this.model.projectFee[index]).subscribe((result:QuestionBase<any>[])=>{
      this.createService.create({title:'Edit project fee',questions:result}).then(
        (result:string)=>{
          var newItem = JSON.parse(result)
          this.model.projectFee[index] = newItem;
        }
      )
    })
  }

  removeThisItem(index:number){
    this.model.projectFee.splice(index,1);
  }

  addNewFeeItem(){
    this.questionService.getCreateProjectFeeQuestions().subscribe((result:QuestionBase<any>[])=>{
      this.createService.create({title:'Create new project fee',questions:result}).then(
        (result:string)=>{
          var newItem = JSON.parse(result)
          this.model.projectFee.push(newItem);
        }
      )
    })
  }

  addNewFlow(){
    this.questionService.getCreateProjectFlowQuestions().subscribe((result:QuestionBase<any>[])=>{
      this.createService.create({title:"Create new project flow",questions:result}).then(
        (result:string)=>{
          let count = this.model.projectFlow.length;
          this.editorConfig.projectFlow.push(
            {
              ckfinder:{
                uploadUrl:environment.API_URL+'/pictures/content-image-upload?id='+this.model.projectId+'&field=flow'+count,
                options: {
                  resourceType: 'Images'
                }
              }
            });
          this.model.projectFlow.push({
            title:JSON.parse(result).title,
            content:'<p></p>'
          });
          var newEditor = ClassicEditor;
          this.projectFlow.push(newEditor);
        },
        () => {
        }
      )
    })
  }

  removeThisFlow(index:number)
  {
    this.editorConfig.projectFlow.splice(index,1);
    this.model.projectFlow.splice(index,1)
    this.projectFlow.splice(index,1);
  }

  updateNewCoverImageSource(imageId:string,newImage:File)
  {
    this.coverImage.content = newImage;
    if(this.model.image=='default')
    {
      this.coverImage.status = 'initial';
    }
    else
    {
      this.coverImage.status = 'update'
    }
  }

}
