import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { ProjectsService } from 'src/services/projects.service';
import { Observable } from 'rxjs';
import { projectDetailViewModel } from 'src/models/viewModels/projectsViewModels/projectDetailViewModel';

@Injectable()
export class projectDetailResolver implements Resolve<projectDetailViewModel> {
    constructor(private projectService:ProjectsService, private router: Router) { }
    
    resolve(route: ActivatedRouteSnapshot): Observable<projectDetailViewModel> {  
        return this.projectService.getProjectWithId(route.params.projectId);
      }  
}
