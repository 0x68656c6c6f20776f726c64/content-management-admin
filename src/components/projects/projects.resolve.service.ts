import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { ProjectsService } from 'src/services/projects.service';
import { Observable } from 'rxjs';
import { projectCardViewModel } from 'src/models/viewModels/projectsViewModels/projectCardViewModel';
import { project_categoryViewModel } from 'src/models/viewModels/projectsViewModels/project_categoryViewModel';

@Injectable()
export class projectResolver implements Resolve<projectCardViewModel[]> {
    constructor(private projectService:ProjectsService, private router: Router) { }
    
    resolve(route: ActivatedRouteSnapshot): Observable<projectCardViewModel[]> {  
        return this.projectService.getProjectList();
      }  
}

@Injectable()
export class project_categoryResolver implements Resolve<project_categoryViewModel[]> {
    constructor(private projectService:ProjectsService, private router: Router) { }
    
    resolve(route: ActivatedRouteSnapshot): Observable<project_categoryViewModel[]> {  
        return this.projectService.getProjectCategoryList();
      }  
}