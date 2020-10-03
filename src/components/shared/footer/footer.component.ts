import { Component, HostBinding } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'footer-cmp',
    templateUrl: 'footer.component.html'
})

export class FooterComponent{
    test : Date = new Date();

    goToCustomerLink()
    {
      window.open(environment.CUSTOMER_URL,"_blank");
    }
}


