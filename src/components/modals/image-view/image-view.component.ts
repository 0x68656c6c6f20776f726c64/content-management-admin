import { Component, Input, Injectable, TemplateRef, Directive } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  contentModalKeyValue } from 'src/models/modals/contentModal';

interface ImageViewOptions {
  /**
   * The title of the confirmation modal
   */
  title: string,

  /**
   * The message in the confirmation modal
   */
  content:string,

}

@Injectable()
export class ImageViewState {
  /**
   * The last options passed ConfirmService.confirm()
   */
  options: ImageViewOptions;

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
export class ImageViewService {

  constructor(private modalService: NgbModal, private state: ImageViewState) {}

  /**
   * Opens a confirmation modal
   * @param options the options for the modal (title and message)
   * @returns {Promise<any>} a promise that is fulfilled when the user chooses to confirm, and rejected when
   * the user chooses not to confirm, or closes the modal
   */
  create(options: ImageViewOptions): Promise<any> {
    this.state.options = options;
    this.state.modal = this.modalService.open(this.state.template,{size:'xl'});
    return this.state.modal.result;
  }
}


@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})

export class ImageViewComponent{

  options: ImageViewOptions;

  constructor(private state: ImageViewState) {
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
  selector: "[image-view]"
})
export class ImageViewTemplateDirective {
  constructor(ImageViewTemplate: TemplateRef<any>, state: ImageViewState) {
    state.template = ImageViewTemplate;
  }
}
