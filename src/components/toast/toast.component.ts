import { Component, OnInit } from '@angular/core';
import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[]=[];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}

@Component({
  selector: 'app-toasts',
  templateUrl: './toast.component.html',
  host: {'[class.ngb-toasts]': 'true'}
})
export class ToastsContainer{

  constructor(public toastService:ToastService) { }

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }

}
