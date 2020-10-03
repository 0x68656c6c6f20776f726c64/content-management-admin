import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UniqueValidator } from 'src/components/shared/helpers/unique-cat-key-check.directive';
import { QuestionBase } from 'src/models/questions';


@Injectable()
export class QuestionControlService {
  constructor(private uniqueValidator:UniqueValidator) { }

  toFormGroup(questions: QuestionBase<string>[] ) {
    const group: any = {};

    questions.forEach(question => {
      if(question.required && question.validationType=='category')
      {
        //console.log(question.required+ '  '+question.validationType);
        group[question.key] = new FormControl(question.value || '', {
          validators:[
          Validators.required,
         // this.uniqueValidator.validate.bind(this.uniqueValidator)
        ],
        asyncValidators:[this.uniqueValidator.validate.bind(this.uniqueValidator)],
        updateOn: 'blur'
      })
      }
      else if(question.required)
      {
        group[question.key] = new FormControl(question.value || '', Validators.required)
      }
      else
      {
        group[question.key] = new FormControl(question.value || '')
      }
    });
    return new FormGroup(group);
  }

}
