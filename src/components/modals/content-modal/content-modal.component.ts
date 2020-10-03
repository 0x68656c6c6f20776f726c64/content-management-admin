import { Component, Input, Injectable, TemplateRef, Directive } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  contentModalKeyValue } from 'src/models/modals/contentModal';

interface ContentOptions {
  /**
   * The title of the confirmation modal
   */
  title: string,

  /**
   * The message in the confirmation modal
   */
  content:contentModalKeyValue[];
}

@Injectable()
export class ContentState {
  /**
   * The last options passed ConfirmService.confirm()
   */
  options: ContentOptions;

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
export class ContentService {

  constructor(private modalService: NgbModal, private state: ContentState) {}

  /**
   * Opens a confirmation modal
   * @param options the options for the modal (title and message)
   * @returns {Promise<any>} a promise that is fulfilled when the user chooses to confirm, and rejected when
   * the user chooses not to confirm, or closes the modal
   */
  content(options: ContentOptions): Promise<any> {
    this.state.options = options;
    this.state.modal = this.modalService.open(this.state.template);
    return this.state.modal.result;
  }
}


@Component({
  selector: 'app-content-modal',
  templateUrl: './content-modal.component.html',
  styleUrls: ['./content-modal.component.css']
})

export class ContentModalComponent{

  options: ContentOptions;

  constructor(private state: ContentState) {
    this.options = state.options;
  }

  close() {
    this.state.modal.close('CLOSE');
  }
}

/**
 * Directive allowing to get a reference to the template containing the confirmation modal component,
 * and to store it into the internal confirm state service. Somewhere in the view, there must be
 *
 * ```
 * <template confirm>
 *   <confirm-modal-component></confirm-modal-component>
 * </template>
 * ```
 *
 * in order to register the confirm template to the internal confirm state
 */
@Directive({
  selector: "[content]"
})
export class ContentTemplateDirective {
  constructor(contentTemplate: TemplateRef<any>, state: ContentState) {
    state.template = contentTemplate;
  }
}
