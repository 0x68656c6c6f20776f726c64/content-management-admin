import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './../models/user';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
    private API_URL = environment.API_URL;
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(this.API_URL+'/users');
    }

    getOne(id:string){
        return this.http.get<User>(this.API_URL+'/users/'+id)
    }

    register(user: User) {
        return this.http.post(this.API_URL+'/users/register', user);
    }

    delete(id: string) {
        return this.http.delete(this.API_URL+'/users/'+id);
    }
}
