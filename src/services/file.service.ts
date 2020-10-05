import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { file } from 'src/models/schemas/file';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  private API = environment.API_URL

  constructor(private http:HttpClient) { }

  // getFileWithId(fileId:string):Observable<file>
  // {
  //   return this.http.get<file>(this.API+'/')
  // }
}
