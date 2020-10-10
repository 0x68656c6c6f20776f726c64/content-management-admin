import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as CKSource from './../../ckeditor/build/cksource';
import { articleViewModel } from 'src/models/viewModels/articleViewModel';
import { ImageUploadMessage } from 'src/models/helpers/ImageUploadMessage';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ArticlesService } from 'src/services/articles.service';
import { ToastService } from '../toast/toast.component';
import { fileReturn, httpReturn } from 'src/models/httpReturn';
import { FormControl, FormGroup } from '@angular/forms';
import { ImageService } from 'src/services/image.service';

const ClassicEditor = CKSource.ClassicEditor;

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements AfterViewInit {

  public loading = false;

  public Editor = ClassicEditor;

  public EditorConfig;


  coverImage:ImageUploadMessage;

  public model: articleViewModel;
  constructor(private imageService:ImageService,private toastService:ToastService,private route:ActivatedRoute,private articleService:ArticlesService) {
    this.model = this.route.snapshot.data.article;
    this.coverImage = {id:this.model.articleId+'-cover',content:null,status:'normal'};
    this.EditorConfig = {     
      // simpleUpload: {
      //   // The URL that the images are uploaded to.
      //   uploadUrl: environment.API_URL+'/pictures/content-image-upload?id='+this.model.articleId+'&field=main',
      // }
     ckfinder:{
        //uploadUrl:'https://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json',
        uploadUrl:environment.API_URL+'/pictures/content-image-upload?id='+this.model.articleId+'&field=main',
        options: {
          resourceType: 'Images'
        }
      }
   }
  }


  ngAfterViewInit(): void {
  }

  updateNewSlideImageSource(sid:string, newImage:File)
  {
    this.coverImage.content=newImage;
    console.log(this.model.image);
    if(this.model.image=='default')
    {
      this.coverImage.status = 'initial';
    }
    else
    {
      this.coverImage.status = 'update'
    }
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
            this.articleService.updateArticle(this.model).subscribe(
              (result:httpReturn)=>{
                if(result.message=='success')
                {
                  this.loading = false;
                  this.toastService.show('success update article: '+this.model.articleId,{classname:'bg-success text-light',delay:2000});
                }
                else
                {
                  this.loading = false;
                  this.toastService.show('failed update article: '+this.model.articleId+'\n Article '+result.message,{classname:'bg-danger text-light',delay:2000});
                }
              }
            )
          }
          else
          {
            this.loading = false;
            this.coverImage.status = 'fail';
            this.toastService.show('failed update cover image: '+this.model.articleId+'\n Image '+imageUpload.result.message,{classname:'bg-danger text-light',delay:2000});
          }
        }
      )
    }
    else
    {
      this.articleService.updateArticle(this.model).subscribe(
        (result:httpReturn)=>{
          if(result.message=='success')
          {
            this.loading = false;
            this.toastService.show('success update article: '+this.model.articleId,{classname:'bg-success text-light',delay:2000});
          }
          else
          {
            this.loading = false;
            this.toastService.show('failed update article: '+this.model.articleId+'\n Article '+result.message,{classname:'bg-danger text-light',delay:2000});
          }
        }
      )
    }   
  }
}
