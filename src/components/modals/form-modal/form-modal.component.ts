import { Component, OnInit, Injectable, TemplateRef, Directive, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuestionBase } from 'src/models/questions';
import { QuestionControlService } from 'src/services/question/question-control.service';
import { QuestionService } from 'src/services/question/question.service';


interface CreateOptions {
  /**
   * The title of the confirmation modal
   */
  title: string,

  /**
   * The message in the confirmation modal
   */
  questions:QuestionBase<any>[]
}

@Injectable()
export class CreateState {
  /**
   * The last options passed ConfirmService.confirm()
   */
  options: CreateOptions;

  /**
   * The last opened confirmation modal
   */
  modal: NgbModalRef;

  /**
   * The template containing the confirmation modal component
   */
  template: TemplateRef<any>;
}

@Injectable()
export class CreateService {

  constructor(private modalService: NgbModal, private state: CreateState) {}

  /**
   * Opens a confirmation modal
   * @param options the options for the modal (title and message)
   * @returns {Promise<any>} a promise that is fulfilled when the user chooses to confirm, and rejected when
   * the user chooses not to confirm, or closes the modal
   */
  create(options: CreateOptions): Promise<any> {
    this.state.options = options;
    this.state.modal = this.modalService.open(this.state.template);
    return this.state.modal.result;
  }
}

@Component({
  selector: 'app-form-modal',
  templateUrl: './form-modal.component.html',
  styleUrls: ['./form-modal.component.css'],
  providers:  [QuestionService]
})
export class FormCreateModalComponent implements OnInit {

  loading = false;

  form:FormGroup

  options:CreateOptions;

  constructor(private state: CreateState, private qcs:QuestionControlService) {
    this.options = state.options;
   }

  ngOnInit(): void {
    this.form = this.qcs.toFormGroup(this.options.questions);
  }

  dismiss(){
    this.state.modal.dismiss('dismissed');
  }

  onSubmit(){
    this.state.modal.close(JSON.stringify(this.form.getRawValue()));
  }

  canSubmit(){
    return this.form.valid;
  }

}

@Directive({
  selector: "[create]"
})
export class CreateTemplateDirective {
  constructor(createTemplate: TemplateRef<any>, state: CreateState) {
    state.template = createTemplate;
  }
}
