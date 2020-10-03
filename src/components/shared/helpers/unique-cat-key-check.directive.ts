import { Directive, forwardRef, Injectable, Input} from '@angular/core';
import { AbstractControl, AsyncValidator,  NG_ASYNC_VALIDATORS, ValidationErrors, } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map,  } from 'rxjs/operators';
import { ProjectsService } from 'src/services/projects.service';

@Injectable({ providedIn: 'root' })
export class UniqueValidator implements AsyncValidator{
    @Input('validationType') validationType: string;
    constructor(private projectService:ProjectsService){}
    validate(control: AbstractControl): Promise<ValidationErrors> | Observable<ValidationErrors> {
        return this.projectService.getProjectCategory(control.value).pipe(
            map(res=> { 
              return ((res!=null) ? {unique:"category key: {"+control.value+"} already exsited"}:null)}),
            catchError(()=>of(null))
        )
    }
}

@Directive({
  selector: '[uniqeValidation]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: forwardRef(() => UniqueValidator), multi: true}]
})
export class UniqueValidatorDirective {
  constructor(private validator:UniqueValidator){}

  validate( control: AbstractControl){
      this.validator.validate(control);
  }
}