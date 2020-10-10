import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { ProjectsComponent } from 'src/components/projects/projects.component';
import {  DropdownQuestion, QuestionBase, TextboxQuestion } from 'src/models/questions';
import { project_categoryViewModel } from 'src/models/viewModels/projectsViewModels/project_categoryViewModel';
import { ProjectsService } from '../projects.service';

@Injectable()
export class QuestionService {

  getCreateProjectQuestions(){
    const createProject:QuestionBase<string>[] = [
      new TextboxQuestion({
        key:'title',
        label:'Title',
        required:true,
        order:1
      }),
      new TextboxQuestion({
        key:'subtitle',
        label:'Subtitle',
        required:true,
        order:2
      }),
      new DropdownQuestion({
              key: 'hot',
              label: 'Hot',
              options: [
                {key: 'true',  value: 'Yes'},
                {key: 'false',  value: 'No'}
              ],
              order: 3
         }),
    ]
    return of(createProject.sort((a, b) => a.order - b.order));
  }

  getCreateArticleQuestions(){
    const createArticle:QuestionBase<string>[] = [
      new TextboxQuestion({
        key:'title',
        label:'Title',
        required:true,
        order:1
      }),
      new TextboxQuestion({
        key:'subtitle',
        label:'Subtitle',
        required:true,
        order:2
      })
    ]
    return of(createArticle.sort((a, b) => a.order - b.order));
  }


  getCreateProjectCategoryForm()
  {
    const createProjectCategory:QuestionBase<string>[] = [
      new TextboxQuestion({
        key:'key',
        label:'Key',
        required:true,
        validationType:'category',
        order:1
      }),
      new TextboxQuestion({
        key:'title',
        label:'Title',
        required:true,
        order:2
      })
    ]
    return of(createProjectCategory.sort((a, b) => a.order - b.order));
  }

  getCategoryUpdateForm(title:string)
  {
    const categoryUpdate:QuestionBase<string>[] = [new TextboxQuestion({
      key:'title',
      label:'Title',
      required:true,
      value:title,
      order:1
    })]
    return of(categoryUpdate.sort((a, b) => a.order - b.order));
  }

  getEditInputForm(inputs)
  {
    const editInput:QuestionBase<string>[] = [
      new TextboxQuestion({
        key:'label',
        label:'Label',
        required:true,
        value:inputs.lable,
        order:1
      }),
      new TextboxQuestion({
        key:'placeholder',
        label:'Placeholder',
        value:inputs.placeholder,
        order:2
      })
    ]
    return of(editInput.sort((a, b) => a.order - b.order));
  }

  getCreateInputForm()
  {
    const createInput:QuestionBase<string>[]=[
      new TextboxQuestion({
        key:'label',
        label:'Label',
        required:true,
        order:1
      }),
      new TextboxQuestion({
        key:'placeholder',
        label:'Placeholder',
        order:2
      })
    ]
    return of(createInput.sort((a, b) => a.order - b.order));
  }

  getAddFormQuestions()
  {
    const addForm:QuestionBase<string>[]=[
      new TextboxQuestion({
        key:'title',
        label:'Title',
        required:true,
        order:1
      })
    ]
    return of(addForm.sort((a,b)=>a.order - b.order));
  }

  getCreateEvaluationQuestions(projectList:string[])
  {
    var createEvaluationForm:QuestionBase<string>[]=[
      new DropdownQuestion({
        key:'projectId',
        label:'Choose Related Project',
        required:true,
        options:[],
        order:1
      })
    ]
    projectList.forEach(element=>{
      var split = element.split(' : ');
      createEvaluationForm[0].options.push({key:split[0],value:split[1]});
    })
    return of(createEvaluationForm);
  }

  getCreateProjectFlowQuestions()
  {
    const projectFlowForm:QuestionBase<string>[]=[
      new TextboxQuestion({
        key:'title',
        label:'Project Flow Title',
        required:true,
        order:1
      }), 
    ]
    return of(projectFlowForm);
  }

  getCreateProjectFeeQuestions()
  {
    const projectFeeForm:QuestionBase<string>[]=[
      new TextboxQuestion({
        key:'title',
        label:'Item',
        required:true,
        order:1
      }),
      new TextboxQuestion({
        key:'amount',
        label:'Cost',
        required:true,
        order:2
      })
    ]
    return of(projectFeeForm.sort((a,b)=>a.order - b.order));
  }

  getEditProjectFeeQuestions(projectFee)
  {
    const projectFeeForm:QuestionBase<string>[]=[
      new TextboxQuestion({
        key:'title',
        label:'Item',
        required:true,
        value:projectFee.title,
        order:1
      }),
      new TextboxQuestion({
        key:'amount',
        label:'Cost',
        value:projectFee.amount,
        required:true,
        order:2
      })
    ]
    return of(projectFeeForm.sort((a,b)=>a.order - b.order)); 
  }

  // TODO: get from a remote source of question metadata
  // getQuestions() {

  //   const questions: QuestionBase<string>[] = [

  //     new DropdownQuestion({
  //       key: 'brave',
  //       label: 'Bravery Rating',
  //       options: [
  //         {key: 'solid',  value: 'Solid'},
  //         {key: 'great',  value: 'Great'},
  //         {key: 'good',   value: 'Good'},
  //         {key: 'unproven', value: 'Unproven'}
  //       ],
  //       order: 3
  //     }),

  //     new TextboxQuestion({
  //       key: 'firstName',
  //       label: 'First name',
  //       value: 'Bombasto',
  //       required: true,
  //       order: 1
  //     }),

  //     new TextboxQuestion({
  //       key: 'emailAddress',
  //       label: 'Email',
  //       type: 'email',
  //       order: 2
  //     })
  //   ];

  //   return of(questions.sort((a, b) => a.order - b.order));
  // }
}
