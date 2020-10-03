import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { httpReturn } from 'src/models/httpReturn';
import { form } from 'src/models/schemas/form';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) {}

  getAllForms():Observable<form[]>{
    return this.http.get<form[]>(this.API_URL+'/forms/');
  }

  getFormById(id:string):Observable<form>{
    return this.http.get<form>(this.API_URL+'/forms/'+id);
  }

  updateForm(param:form):Observable<httpReturn>{
    return this.http.put<httpReturn>(this.API_URL+'/forms/update',param);
  }

  createForm(param):Observable<httpReturn>{
    return this.http.post<httpReturn>(this.API_URL+'/forms/create',param);
  }

  deleteForm(id:string):Observable<httpReturn>{
    return this.http.delete<httpReturn>(this.API_URL+'/forms/'+id);
  }
}
