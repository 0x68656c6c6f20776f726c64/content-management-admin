import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { ProjectsService } from 'src/services/projects.service';
import { Observable } from 'rxjs';
import { projectCardViewModel } from 'src/models/viewModels/projectsViewModels/projectCardViewModel';
import { onlineEvaluationPageViewModel } from 'src/models/viewModels/onlineEvaluationPageViewModel';
import { OnlineEvaluationService } from 'src/services/online-evaluation.service';
import { FormService } from 'src/services/form.service';
import { SubmissionService } from 'src/services/submission.service';
import { map, mergeMap } from 'rxjs/operators';
import { onlineEvaluation } from 'src/models/schemas/onlineEvaluation';
import { submission } from 'src/models/schemas/submission';
import { form } from 'src/models/schemas/form';

@Injectable()
export class onlineEvaluationPageResolver implements Resolve<onlineEvaluationPageViewModel> {
    constructor(private projectService:ProjectsService,private submissionService:SubmissionService,private formService:FormService,private onlineEvaluationService:OnlineEvaluationService, private router: Router) { }
    
    resolve(route: ActivatedRouteSnapshot): Observable<onlineEvaluationPageViewModel> {  
        return this.onlineEvaluationService.getAllOnlineEvaluations().pipe(
            mergeMap((oes:onlineEvaluation[])=>{
                return this.formService.getAllForms().pipe(
                    mergeMap((forms:form[])=>{
                        return this.submissionService.getAllSubmission().pipe(
                            mergeMap((submissions:submission[])=>{
                                return this.projectService.getProjectList().pipe(
                                    map((projects:projectCardViewModel[])=>{
                                        const result:onlineEvaluationPageViewModel={
                                            onlineEvaluations:oes.sort((a,b)=>(parseInt(a.evaluationId.slice(12),10)-parseInt(b.evaluationId.slice(12),10))),
                                            formGroups:forms,
                                            submissions:submissions,
                                            projectIdList:projects.map(p=>(p.projectId+' : '+p.title)),
                                        }
                                        result.formGroups.forEach(fg=>{
                                            fg.inputs = fg.inputs.sort((a,b)=> (parseInt(a.inputId.slice(5),10)- parseInt(b.inputId.slice(5),10)));
                                        })
                                        result.onlineEvaluations.forEach(oe=>{
                                            oe.formGroupsId = oe.formGroupsId.sort((a,b)=> (parseInt(a.slice(5),10)- parseInt(b.slice(5),10)))
                                        })
                                        return result;
                                    })
                                )
                            })
                        )
                    })
                )
            })
        )
    }  
}