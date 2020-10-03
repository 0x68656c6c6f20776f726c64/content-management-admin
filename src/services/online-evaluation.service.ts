import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { httpReturn } from 'src/models/httpReturn';
import { onlineEvaluation } from 'src/models/schemas/onlineEvaluation';

@Injectable({
  providedIn: 'root'
})
export class OnlineEvaluationService {

  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getAllOnlineEvaluations():Observable<onlineEvaluation[]>{
    return this.http.get<onlineEvaluation[]>(this.API_URL+'/online_evaluations/');
  }

  updateOnlineEvaluation(param:onlineEvaluation):Observable<httpReturn>{
    return this.http.put<httpReturn>(this.API_URL+'/online_evaluations/update',param);
  }

  createOnlineEvaluation(param):Observable<httpReturn>{
    return this.http.post<httpReturn>(this.API_URL+'/online_evaluations/create',param);
  }

  deleteOnlineEvaluation(id:string):Observable<httpReturn>{
    return this.http.delete<httpReturn>(this.API_URL+'/online_evaluations/'+id);
  }

  getOnlineEvaluationById(id:string):Observable<onlineEvaluation>{
    return this.http.get<onlineEvaluation>(this.API_URL+'/online_evaluations/'+id);
  }

  verifyValidEvaluation(param:onlineEvaluation):Observable<httpReturn>{
    return this.http.post<httpReturn>(this.API_URL+'/online_evaluations/verify',param);
  }
}
