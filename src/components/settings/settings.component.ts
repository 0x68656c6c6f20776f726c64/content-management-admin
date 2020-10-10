import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { element } from 'protractor';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { ImageService } from 'src/services/image.service';
import { SettingsService } from 'src/services/settings.service';
import { settings } from 'src/models/schemas/settings';
import { ActivatedRoute } from '@angular/router';
import { fileReturn, httpReturn } from 'src/models/httpReturn';
import { ToastService } from '../toast/toast.component';
import { ImageUploadComponent } from '../shared/image-upload/image-upload.component';
import { ImageUploadMessage } from 'src/models/helpers/ImageUploadMessage';
import { ModifiedImage } from 'src/models/helpers/modifiedImage';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  @ViewChild('security') security:NgbModal;
  @ViewChild('regularAcc') accordion:NgbAccordion;

  model:settings;

  secureModel;

  rootAccount=true;

  private_key=''

  toast;

  public logo='logo';

  public loading=false;


  alert=[
    {
      id:'root_password',
      status:'',
      message:''
    },
    {
      id:'private_key',
      status:'',
      message:''
    }
  ]

  companyLogo:ImageUploadMessage;
  slides:ImageUploadMessage[];

  settingForms = [
    {
      title:"Page Settings",
      formId:'0',
      toggled:false
    },
    {
      title:"Company Info Settings",
      formId:'1',
      toggled:false
    },
    {
      title:"Security Settings",
      formId:'2',
      unlocked:false
    }
  ];

  constructor(private toastService:ToastService,private settingService:SettingsService,private route: ActivatedRoute,private modalService:NgbModal,private image:ImageService) { }

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
    this.model = this.route.snapshot.data.setting;
    this.slides = this.model.slides.map(function(s){
      return {id:s,content:null,status:'normal'}
    })
    this.companyLogo = {id:this.model.companyInfo.companyLogo,content:null,status:'normal'};
    // if(localStorage.getItem('private_key'))
    // {
    //   this.private_key = localStorage.getItem('private_key');
    // }
    // else
    // {
    //   this.private_key = "";
    // }

    // if(localStorage.getItem('slides'))
    // {
    //   this.slides = this.image.getSlidesImage();
    // }
    // else
    // {
    //   this.slides = [];
    // }
  }

  updateCompanyInfo(){
    this.loading = true;
    this.settingService.updateCompanyInfo(this.model.companyInfo).subscribe(
      (result:httpReturn)=>{
        if(result.message=='success')
        {
          this.loading = false;
          this.toastService.show('successful update company information: ',{classname:'bg-success text-light',delay:2000});
        }
        else
        {
          this.loading = false;
          this.toastService.show('failed to update company information Error: \n'+result.message,{classname:'bg-danger text-light',delay:2000});
        }
      }
      );
  }

  toggledThis(panelId:string)
  {
    this.accordion.toggle(panelId);
    var settingObject = this.settingForms.find(object=>(object.formId==panelId));
    settingObject.toggled = !settingObject.toggled;
  }

  unlockSecurityArea(){
    this.modalService.open(this.security,{centered:true, ariaLabelledBy: 'modal-basic-title'}).result.then(
      (result)=>{
        if(result=='123')
        {
          this.settingForms[2].unlocked= true;
          this.accordion.expand('2');
        }
      }
    );
  }

  lockSecurityArea(){
    this.settingForms[2].unlocked=false;
    this.accordion.collapse('2');
    this.secureModel = null;
  }

  editThisAccount(accoutId:string){}

  removeThisAccount(accountId:string){}

  resetRootPassword(){}

  generateNewPrivateKey(){
    this.secureModel.private_key = this.makeid(64);
  }

  uploadNewPrivateKey(){
    this.loading = true;
    this.settingService.updatePrivateKey(this.secureModel.private_key).subscribe((result:httpReturn)=>{
      if(result.message=='success') 
      {
        this.loading = false;
        this.toastService.show('success upload private key',{classname:'bg-success text-light',delay:2000});
      }
      else
      {
        this.loading = false;
        this.toastService.show('failed upload private key Error:\n'+result.message,{classname:'bg-danger text-light',delay:2000});
      }
    });
  }

  closeAlert(target){
    var object = this.alert.find(element=>(element.id==target.id));
    object.status='';
    object.message='';
  }

  updateDescriptions()
  {
    this.loading = true;
    this.settingService.updateDescription({about_us_description:this.model.about_us_description,news_descritpion:this.model.news_description}).subscribe(
    (result:httpReturn)=>{
      if(result.message=='success')
      {
        this.loading = false;
        this.toastService.show('successful update description: ',{classname:'bg-success text-light',delay:2000});
      }
      else
      {
        this.loading = false;
        this.toastService.show('failed update description Error: \n'+result.message,{classname:'bg-danger text-light',delay:2000});
      }
    }
    )
  }

  updateSlides(){
    this.model.slides=this.slides.map(s=>s.id);
    this.slides.forEach(
      s=>{
        if(s.content!=null)
        {
          this.image.uploadImage({id:s.id,content:s.content,status:s.status}).subscribe(
            (response:fileReturn)=>{
              if(response.result.message!='success')
              {
                this.toastService.show('failed to modify slide: '+s.id+'\n Error: '+response.result.message,{classname:'bg-danger text-light',delay:2000});
                s.status=='fail';
              }
              else
              {
                s.content=null;
                s.status=='success';
              }
            }
          )
        }
      }
    )
    this.settingService.updateSlides(this.model.slides).subscribe((result:httpReturn)=>{
      if(result.message=='success')
      {
        this.toastService.show('successful update slides',{classname:'bg-success text-light',delay:2000});
      }
      else
      {
        this.toastService.show('failed update slides \n Error: '+result.message,{classname:'bg-danger text-light',delay:2000});
      }
    })    
  }

  updateNewSlideImageSource(id:string,newImage:File){
    this.slides.find(s=>s.id==id).content=newImage;
  }

  addNewSlide(){
    const newId = this.generateNewSlidesId();
    this.slides.push({id:newId,content:null,status:'initial'});
  }

  removeThisSlide(slideIndex:number){
    if(this.slides[slideIndex].status!='initial')
    {
      this.image.removeThisImage(this.slides[slideIndex].id).subscribe(
        (result:httpReturn)=>{
          if(result.message=='success')
          {
            this.model.slides.splice(this.model.slides.findIndex(ms=>ms==this.slides[slideIndex].id));
            this.settingService.updateSettings(this.model).subscribe(
              (response:httpReturn)=>{
                if(response.message=='success')
                {
                  this.toastService.show('successful delete slides',{classname:'bg-success text-light',delay:2000});
                }
              }
            )
            this.slides.splice(slideIndex,1);
          }
        }
      )
    }
    else
    {
      this.slides.splice(slideIndex,1);
    }
  }

  updateHomePageSettings(){}

  private generateNewSlidesId(){
    var lastSlideId = this.slides[this.slides.length-1].id;
    var number = parseInt(lastSlideId.slice(5),10);
    return 'slide'+(number+1);
  }

  private makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }


}

