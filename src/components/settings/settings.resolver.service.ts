import { Injectable } from '@angular/core';
import {
    Router, Resolve,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { settings } from 'src/models/schemas/settings';
import { SettingsService } from 'src/services/settings.service';

@Injectable()
export class settingsResolver implements Resolve<settings> {
    constructor(private settingService:SettingsService, private router: Router) { }
    
    resolve(route: ActivatedRouteSnapshot): Observable<settings> {  
        return this.settingService.getSettings()
      }  
}