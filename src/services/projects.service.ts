import { Injectable } from '@angular/core';
import { projectCardViewModel } from 'src/models/viewModels/projectsViewModels/projectCardViewModel';
import { project_categoryViewModel } from 'src/models/viewModels/projectsViewModels/project_categoryViewModel';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { projectDetailViewModel } from 'src/models/viewModels/projectsViewModels/projectDetailViewModel';
import { projectCreate } from 'src/models/viewModels/projectsViewModels/projectCreateModel';
import { Observable, of } from 'rxjs';
import { project_categoryResolver } from 'src/components/projects/projects.resolve.service';
import { httpReturn } from 'src/models/httpReturn';
import { element } from 'protractor';
import { debounceTime, map, share } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}


  getProjectList():Observable<projectCardViewModel[]>
  {
    return this.http.get<projectCardViewModel[]>(this.API_URL+'/projects').pipe();
  }

  getProjectCategoryList():Observable<project_categoryViewModel[]>
  {
    return this.http.get<project_categoryViewModel[]>(this.API_URL+'/projects_categories').pipe();
  }

  getProjectWithId(projectId:string)
  {
    return this.http.get<projectDetailViewModel>(this.API_URL+'/projects/'+projectId)
  }

  getPorjectsWithCategory(cat:string)
  {
    return this.http.get<projectCardViewModel[]>(this.API_URL+'/projects',{
      params:{
        category:cat
      }
    });
  }

  updateProjectsWithId(projectParam:projectDetailViewModel)
  {
     return this.http.put(this.API_URL+'/projects/update',{
       body:projectParam
     });
  }

  createProject(projectParam:projectCreate):Observable<httpReturn>
  {
    return this.http.post<httpReturn>(this.API_URL+'/projects/create',projectParam)
  }

  deleteProjectWithId(projectId:string):Observable<httpReturn>
  {
    return this.http.delete<httpReturn>(this.API_URL+'/projects/'+projectId);
  }

  updateProjectCards(modifiedProjectList:projectCardViewModel[]):Observable<httpReturn>[]
  {
    var responseList:Observable<httpReturn>[] = [];
    for(let i=0;i<modifiedProjectList.length;i++)
    {
      if(modifiedProjectList[i].disabled)
      {
        responseList.push( this.http.post<httpReturn>(this.API_URL+'/projects/disable/'+modifiedProjectList[i].projectId,{body:null}).pipe(share()));
        // .subscribe({next(result:httpReturn){responseList.push(result);console.log(result)}})
      }
      else
      {
        responseList.push( this.http.post<httpReturn>(this.API_URL+'/projects/enable/'+modifiedProjectList[i].projectId,{body:null}).pipe(share()));
      }
    }
    return responseList;
  }

  createProjectCategory(projectCategoryParam:project_categoryViewModel):Observable<httpReturn>
  {
    return this.http.post<httpReturn>(this.API_URL+'/projects_categories/create',projectCategoryParam);
  }

  getProjectCategory(cat:string):Observable<project_categoryViewModel>{
    if(!cat || (cat=='Hot'||cat=='All')) return of({key:'error',title:'error'});
    return this.http.get<project_categoryViewModel>(this.API_URL+'/projects_categories/'+cat);
  }

  updateProjectCategory(param:project_categoryViewModel):Observable<httpReturn>{
    return this.http.put<httpReturn>(this.API_URL+'/projects_categories/update',param);
  }

  deleteCategoryWithKey(key:string):Observable<httpReturn>{
    return this.http.delete<httpReturn>(this.API_URL+'/projects_categories/'+key);
  }

  // enableProjectWithId(projectId:string)
  // {
  //   return this.http.post(this.API_URL+'/projects/enable/'+projectId,{
  //     body:null
  //   });
  // }

  // disableProjectWithId(projectId:string)
  // {
  //   return this.http.post(this.API_URL+'/projects/disable/'+projectId,{
  //     body:null
  //   });
  // }

}
