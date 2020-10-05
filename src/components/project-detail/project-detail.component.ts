import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ProjectsService } from 'src/services/projects.service';
import * as CKSource from './../../ckeditor/build/cksource';
import { ActivatedRoute } from '@angular/router';
import { projectDetailViewModel } from 'src/models/viewModels/projectsViewModels/projectDetailViewModel';
import { ImageUploadMessage } from 'src/models/helpers/ImageUploadMessage';

const ClassicEditor = CKSource.ClassicEditor;

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css']
})
export class ProjectDetailComponent implements AfterViewInit {

  public projectDetail = ClassicEditor;

  public projectRequirement = ClassicEditor;

  public projectFlow = []
  
  public model:projectDetailViewModel;

  coverImage:ImageUploadMessage;

  public loading = false;

  constructor(private route:ActivatedRoute, private projectService:ProjectsService) { }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this.model = this.route.snapshot.data.project;
    this.model.projectFlow.forEach(element => {
        var newEditor = ClassicEditor;
        this.projectFlow.push(newEditor);
    });
    this.coverImage = {id:this.model.projectId+'-cover',content:null,status:'normal'};
    // this.route.params.subscribe(params=>{
    //   this.model = this.projectService.getProjectWithId(params['projectId']);
    //   this.model.projectFlow.forEach(element => {
    //     var newEditor = ClassicEditor;
    //     this.projectFlow.push(newEditor);
    //   });
    // });
  }

  onSubmit(){}

  editThisItem(index:number){}

  removeThisItem(index:number){}

  addNewFeeItem(){}

  addNewFlow(){}

}
