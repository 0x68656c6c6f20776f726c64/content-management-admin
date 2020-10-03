import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionBase } from 'src/models/questions';

@Component({
  selector: 'app-question',
  styleUrls: ['./dynamic-form-question.component.css'],
  templateUrl: './dynamic-form-question.component.html'
})
export class DynamicFormQuestionComponent {
  @Input() question: QuestionBase<string>;
  @Input() form: FormGroup;
  get isinValid() { 
    // if(this.form.controls[this.question.key].errors['unique'])
    // {
    //   console.log(this.form.controls[this.question.key].errors['unique']);
    // }
    //console.log(this.form.controls[this.question.key].errors);
    const thisControl = this.form.controls[this.question.key];
    return thisControl.invalid && (thisControl.dirty || thisControl.touched)
  }
}
