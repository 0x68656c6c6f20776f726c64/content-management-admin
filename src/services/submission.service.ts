import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { httpReturn } from 'src/models/httpReturn';
import { submission } from 'src/models/schemas/submission';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  private API_URL = environment.API_URL;

  constructor(private http: HttpClient) {}

  getAllSubmission():Observable<submission[]>{
    return this.http.get<submission[]>(this.API_URL+'/submissions/');
  }

  getSubmissionById(id:string):Observable<submission>{
    return this.http.get<submission>(this.API_URL+'/submissions/'+id);
  }

  updateSubmission(param:submission):Observable<httpReturn>{
    return this.http.put<httpReturn>(this.API_URL+'/submissions/update',param);
  }

  createSubmission(param:submission):Observable<httpReturn>{
    return this.http.post<httpReturn>(this.API_URL+'/submissions/create',param);
  }

  deleteSubmission(id:string):Observable<httpReturn>{
    return this.http.delete<httpReturn>(this.API_URL+'/submissions/'+id);
  }
}
