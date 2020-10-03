import { validationRequest } from './validationRequest';

export class QuestionBase<T> {
    value: T;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    type: string;
    for:string;
    options: {key: string, value: string}[];
    validationType:string;
  
    constructor(options: {
        value?: T;
        key?: string;
        label?: string;
        required?: boolean;

        order?: number;
        controlType?: string;
        type?: string;
        options?: {key: string, value: string}[];
        validationType?:string;
      } = {}) {
      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.required = !!options.required;
      this.order = options.order === undefined ? 1 : options.order;
      this.controlType = options.controlType || '';
      this.type = options.type || '';
      this.options = options.options || [];
      this.validationType = options.validationType || '';
    }
  }

  export class DropdownQuestion extends QuestionBase<string> {
    controlType = 'dropdown';
  }

  export class TextboxQuestion extends QuestionBase<string> {
    controlType = 'textbox';
  }
