import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import{ environment } from './../environments/environment';

import { User } from './../models/user';
import { invalidPass } from 'src/models/invalidPass';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private SERVER_URL = environment.SERVER_URL;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser :Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue():User{
         return this.currentUserSubject.value;
    }

    login(username: string, password: string) {
        return this.http.post<any>(this.SERVER_URL+'/users/authenticate', { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser',JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    checkWrongTimes()
    {
        var indicator:invalidPass =JSON.parse(localStorage.getItem('invalidPass'));
        if(indicator)
        {
            if(indicator.expireDate<Date.now())
            {
                localStorage.removeItem('invalidPass');
                return true;
            }
            else if(indicator.times>3)
            {
                return false;
            }
            else
            {
                localStorage.setItem('invalidPass',JSON.stringify({times:indicator.times+1,expireDate:Date.now()+(60 * 60 * 24 * 1000)}));
                return true;
            }
        }
        else
        {
            localStorage.setItem('invalidPass',JSON.stringify({times:1,expireDate:Date.now()+(60 * 60 * 24 * 1000)}));
            return true;
        }
    }

    // verifyWithToken(token){
    //     return this.http.post<any>(this.SERVER_URL+'/users/verify',{token}).pipe(map(user=>
    //         {
    //             console.log(user);
    //             if(!user)
    //             {
    //                 console.log(user);
    //                 this.cookie.delete('currentUser');
    //                 localStorage.delete('currentUser');
    //                 this.currentUserSubject.next(null);
    //                 return false;
    //             }
    //             return true;
    //         }));
    // }

    // verifyWithToken(token){
    //     return this.http.get<verifyModel>(this.SERVER_URL+'/users/verify/'+token);
    // }


}