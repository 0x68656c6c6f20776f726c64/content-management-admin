import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { httpReturn } from 'src/models/httpReturn';
import { contentModalKeyValue } from 'src/models/modals/contentModal';
import { QuestionBase } from 'src/models/questions';
import { onlineEvaluationPageViewModel } from 'src/models/viewModels/onlineEvaluationPageViewModel';
import { FormService } from 'src/services/form.service';
import { OnlineEvaluationService } from 'src/services/online-evaluation.service';
import { QuestionService } from 'src/services/question/question.service';
import { SubmissionService } from 'src/services/submission.service';
import { ContentService } from '../modals/content-modal/content-modal.component';
import { CreateService } from '../modals/form-modal/form-modal.component';
import { ConfirmService } from '../modals/remove-confirm-modal/remove-confirm-modal.component';
import { ToastService } from '../toast/toast.component';

@Component({
  selector: 'app-online-evaluation',
  templateUrl: './online-evaluation.component.html',
  styleUrls: ['./online-evaluation.component.css']
})
export class OnlineEvaluationComponent implements OnInit {

  @ViewChild('editInput') editInput:ElementRef;

  model:onlineEvaluationPageViewModel;

  toast;

  loading = false;

  constructor(private submissionService:SubmissionService,private contentService:ContentService,private evaluationService:OnlineEvaluationService,private toastService:ToastService,private confirmService:ConfirmService,private formService:FormService,private createService:CreateService,private questionService:QuestionService,private route: ActivatedRoute) { }

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
    this.model = this.route.snapshot.data.oeModel;
  }

  editFormInput(groupId:string, inputId:string){
    this.questionService.getEditInputForm(this.model.formGroups.find(fg=>fg.groupId==groupId).inputs.find(i=>i.inputId==inputId)).subscribe((result:QuestionBase<any>[])=>{
      this.createService.create({title:"Create new category",questions:result}).then(
        (result:string)=>{
          this.loading = true;
          const request = JSON.parse(result);
          var editedInput =  this.model.formGroups.find(fg=>fg.groupId==groupId).inputs.find(i=>i.inputId==inputId);
          editedInput.lable = request.label;
          editedInput.placeholder = request.placeholder
          //console.log(this.model.formGroups.find(fg=>fg.groupId==groupId));
          this.formService.updateForm(this.model.formGroups.find(fg=>fg.groupId==groupId)).subscribe((data:httpReturn)=>{
            if(data.message=='success')
            {
              this.loading = false;
              this.toastService.show('success edit input in group: '+groupId,{classname:'bg-success text-light',delay:2000});
            }
            else
            {
              this.loading = false;
              this.toastService.show('failed edit input: '+ inputId+' in group: '+groupId+'\n Project '+data.message,{classname:'bg-danger text-light',delay:2000});
            }
          })
        },
        () => {
          this.loading = false;
        }
      )
    })
  }


  removeInput(groupId:string,inputId:string){
    this.loading = true;
    this.confirmService.confirm({ title:'Confirm deletion', message: 'Do you really want to delete input: '+ inputId+' in group: '+groupId }).then(
      () => {
        var removedInputIndex = this.model.formGroups.find(fg=>fg.groupId==groupId).inputs.findIndex(i=>i.inputId==inputId);
        this.model.formGroups.find(fg=>fg.groupId==groupId).inputs.splice(removedInputIndex,1);
        this.formService.updateForm(this.model.formGroups.find(fg=>fg.groupId==groupId)).subscribe((data:httpReturn)=>{
          if(data.message=='success')
          {
            this.loading = false;
            this.toastService.show('success create input in group: '+groupId,{classname:'bg-success text-light',delay:2000});
          }
          else
          {
            this.loading = false;
            this.toastService.show('failed delete input: '+ inputId+' in group: '+groupId+'\n Project '+data.message,{classname:'bg-danger text-light',delay:2000});
          }
        })
      },
      () => {
        this.loading = false;
      });
  }

  addFormGroup(){
    this.questionService.getAddFormQuestions().subscribe((result:QuestionBase<any>[])=>{
      this.createService.create({title:'Create new FormGroup',questions:result}).then(
        (result:string)=>{
          this.loading = true;
          var rawData = JSON.parse(result);
          var newGroupId = this.generateGroupId();
          const newFormGroup = {groupId:newGroupId,title:rawData.title};
          this.formService.createForm(newFormGroup).subscribe((data:httpReturn)=>{
            if(data.message=='success')
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'success',message:'success create group: '+newGroupId}));
              window.location.reload();
            }
            else
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed create input in group: '+newGroupId+'\n '+data.message}));
              window.location.reload();
            }
          })
        },
        ()=>{}
      )
    })
  }

  removeFormGroup(groupId:string){
    this.loading = true;
    this.confirmService.confirm({ title:'Confirm deletion', message: 'Do you really want to delete formGroup: '+groupId }).then(
      () => {
        this.formService.deleteForm(groupId).subscribe((data:httpReturn)=>{
          if(data.message=='success')
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'success',message:'success create input in group: '+groupId}));
            window.location.reload();
          }
          else
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed create group: '+groupId+'\n '+data.message}));
            window.location.reload();
          }
        })
      },
      () => {
        this.loading = false;
      });
  }


  removeableFormGroup(groupId:string){
    var result = true;
    this.model.onlineEvaluations.forEach(oe=>{
      if(oe.formGroupsId.includes(groupId))
      {
        result = false;
      }
    })
    return result;
  }

  addInput(groupId:string){
    this.questionService.getCreateInputForm().subscribe((result:QuestionBase<any>[])=>{
      this.createService.create({title:'Create new input',questions:result }).then(
        (result:string)=>{
          this.loading = true;
          var rawData = JSON.parse(result);
          const createInput = {inputId:this.generateInputId(groupId),lable:rawData.label,placeholder:rawData.placeholder ? rawData.placeholder : ''};
          this.model.formGroups.find(fg=>fg.groupId==groupId).inputs.push(createInput);
          this.formService.updateForm(this.model.formGroups.find(fg=>fg.groupId==groupId)).subscribe((data:httpReturn)=>{
            if(data.message=='success')
            {
              this.loading = false;
              this.toastService.show('success create input in group: '+groupId,{classname:'bg-success text-light',delay:2000});
            }
            else
            {
              this.loading = false;
              this.toastService.show('failed create input in group: '+groupId+'\n Project '+data.message,{classname:'bg-danger text-light',delay:2000});
            }
          });
        },
        () => {
          this.loading = false;
        }
      );
    });
  }

  addNewOnlineEvaluation(){
    this.questionService.getCreateEvaluationQuestions(this.model.projectIdList).subscribe((result:QuestionBase<any>[])=>{
      this.createService.create({title:'Create new Online Evaluation',questions:result}).then(
        (result:string)=>{
          this.loading = true;
          var rawData = JSON.parse(result);
          var validId = this.generateEvaluationId();
          const param = {evaluationId:validId,projectId:rawData.projectId};
          this.evaluationService.createOnlineEvaluation(param).subscribe((data:httpReturn)=>{
            if(data.message=='success')
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'success',message:'success create new Evaluation: '+validId}));
              window.location.reload();
            }
            else
            {
              this.loading = false;
              localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed create new Evaluation: '+validId+'\n '+data.message}));
              window.location.reload();
            }
          })
        },
        ()=>{}
      )
    })
  }

  enableEvaluation(evaluationId:string){
    this.model.onlineEvaluations.find(oe=>oe.evaluationId==evaluationId).disable = false;
  }

  removeEvaluation(evaluationId:string){
    this.loading = true;
    this.confirmService.confirm({ title:'Confirm deletion', message: 'Do you really want to delete evaluation: '+evaluationId }).then(
      () => {
        this.evaluationService.deleteOnlineEvaluation(evaluationId).subscribe((data:httpReturn)=>{
          if(data.message=='success')
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'success',message:'success delete evaluation: '+evaluationId}));
            window.location.reload();
          }
          else
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed delete evaluation: '+evaluationId+'\n '+data.message}));
            window.location.reload();
          }
        })
      },
      () => {
        this.loading = false;
      });
  }

  disabledEvaluation(evaluationId:string){
    this.model.onlineEvaluations.find(oe=>oe.evaluationId==evaluationId).disable = true;
  }

  addThisFormGroup(evaluationId:string,formGroupId:string){
    this.model.onlineEvaluations.find(oe=>oe.evaluationId==evaluationId).formGroupsId.push(formGroupId);
    this.model.onlineEvaluations.find(oe=>oe.evaluationId==evaluationId).formGroupsId.sort((a,b)=>(parseInt(a.slice(5),10) - parseInt(b.slice(5),10)));
  }

  updateEvaluations(){
    this.loading = true;
    var result:Observable<httpReturn>[]=[];
    this.model.onlineEvaluations.forEach(oe=>{
      result.push(this.evaluationService.updateOnlineEvaluation(oe));
    });
    var resultCountDown = result.length;
    result.forEach(element=>{
      element.subscribe((data:httpReturn)=>{
        if(data.message!='success')
        {
          this.loading = false;
          this.toastService.show(data.message,{ classname: 'bg-danger text-light', delay: 10000});
        }
        resultCountDown--;
        if(resultCountDown==0)
        {
          this.loading = false;
          this.toastService.show('Success update evaluations',{classname:'bg-success text-light',delay:2000});
        }
      })
    })
  }

  //revertEvaluations(){}

  removeFormGroupFromOnlineEvaluation(evaluationId:string,formGroupId:string){
    const formGroupIndex = this.model.onlineEvaluations.find(oe=>oe.evaluationId==evaluationId).formGroupsId.findIndex(fg=>fg==formGroupId);
    this.model.onlineEvaluations.find(oe=>oe.evaluationId==evaluationId).formGroupsId.splice(formGroupIndex,1);
  }

  removeThisEvaluationSubmission(submissionId:string){
    this.loading = true;
    this.confirmService.confirm({ title:'Confirm deletion', message: 'Do you really want to delete this submission: '+submissionId }).then(
      () => {
        this.submissionService.deleteSubmission(submissionId).subscribe((data:httpReturn)=>{
          if(data.message=='success')
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'success',message:'success delete submission: '+submissionId}));
            window.location.reload();
          }
          else
          {
            this.loading = false;
            localStorage.setItem('toast',JSON.stringify({type:'danger',message:'failed delete submission: '+submissionId+'\n '+data.message}));
            window.location.reload();
          }
        })
      },
      () => {
        this.loading = false;
      });
  }

  seeSubmissionDetail(submissionId:string){
    var thisSubmission = this.model.submissions.find(s=>s.submissionId==submissionId);
    if(thisSubmission.status!='read')
    {
      thisSubmission.status = 'read';
      this.submissionService.updateSubmission(thisSubmission).subscribe(res=>{
      });
    }
    const showContent:contentModalKeyValue[] = this.model.submissions.find(s=>s.submissionId==submissionId).content.map(function(c){
      return new contentModalKeyValue(c.key,c.value)
    })
    this.contentService.content({title:'Submmisions Content:',content:showContent}).then(
      ()=>{
      },
      ()=>{
      }
    )
  }

  hideThisAdableForm(oeId:string,formId:string):boolean{
    return this.model.onlineEvaluations.find(oe=>oe.evaluationId==oeId).formGroupsId.includes(formId);
  }

  canEnableThisEvaluation(evaluationId:string)
  {
    const relatedProject = this.model.onlineEvaluations.find(oe=>oe.evaluationId==evaluationId).projectId;
    if(this.model.onlineEvaluations.find(oe=>(oe.evaluationId!=evaluationId && !oe.disable && oe.projectId==relatedProject)))
    {
      return false;
    }
    else
    {
      return true;
    }
  }

  private generateInputId(groupId:string)
  {
    var thisGroup = this.model.formGroups.find(e=>e.groupId==groupId);
    if(thisGroup.inputs.length>0)
    {
      thisGroup.inputs.sort((a,b)=>{return a.inputId>=b.inputId ? 1:-1});
      var lastInputId = thisGroup.inputs[thisGroup.inputs.length-1].inputId;
      var number = parseInt(lastInputId.slice(5),10);
      return 'input'+(number+1);
    }
    else
    {
      return 'input1';
    }
  }

  private generateGroupId()
  {
    this.model.formGroups.sort((a,b)=>(parseInt(a.groupId.slice(5),10) - parseInt(b.groupId.slice(5),10)));
    var lastGroupId = this.model.formGroups[this.model.formGroups.length-1].groupId;
    var number = parseInt(lastGroupId.slice(5),10);
    return 'group'+(number+1);
  }

  private generateEvaluationId(){
    this.model.onlineEvaluations.sort((a,b)=>(parseInt(a.evaluationId.slice(12),10)-parseInt(b.evaluationId.slice(12),10)));
    var lastOEID = this.model.onlineEvaluations[this.model.onlineEvaluations.length-1].evaluationId;
    var number = parseInt(lastOEID.slice(2),10);
    return 'oe'+(number+1);
  }

}
