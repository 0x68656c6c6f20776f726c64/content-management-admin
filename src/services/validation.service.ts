import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { httpReturn } from 'src/models/httpReturn';
import { User } from 'src/models/user';
import { validationRequest } from 'src/models/validationRequest';
import { projectCardViewModel } from 'src/models/viewModels/projectsViewModels/projectCardViewModel';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private API_URL = environment.API_URL;
  constructor(private http: HttpClient) { }

  validationByString(req:validationRequest):Observable<httpReturn>{
    if(!req.requestKey) return  new Observable<httpReturn>();
    var result = new BehaviorSubject<httpReturn>(new httpReturn({message:'not exist'}));
    this.http.get<projectCardViewModel[]>(this.API_URL+'/projects',{
      params:{
        category:req.requestKey
      }
    }).subscribe((data:projectCardViewModel[])=>{
      if(data.length>0)
      {
        result.next( new httpReturn({message:'exist'}) );
      }
    });
    // switch(req.requestType){
    //   case('category'):{
    //     this.http.get<projectCardViewModel[]>(this.API_URL+'/projects',{
    //       params:{
    //         category:req.requestKey
    //       }
    //     }).subscribe((data:projectCardViewModel[])=>{
    //       if(data.length>0)
    //       {
    //         result.next( new httpReturn({message:'exist'}) );
    //       }
    //     });
    //     break;
    //   }
    //   case('username'):{
    //     this.http.get<User>(this.API_URL+'/users/'+req.requestKey).subscribe((data:User)=>{
    //       if(data)
    //       {
    //         result.next( new httpReturn({message:'exist'}));
    //       }
    //     });
    //     break;
    //   }
    // }
   //result.asObservable().subscribe((data:httpReturn)=>console.log(data));
    return result.asObservable();
  }
}
