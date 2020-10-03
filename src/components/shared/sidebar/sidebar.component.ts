import { Component, OnInit, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { MENU_ITEMS } from 'src/services/path.service';

export interface RouteInfo {
  path: string;
  title: string;
  class: string;
}

@Component({
  selector: 'sidebar-cmp',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {


  public menuItems = MENU_ITEMS.filter(menuItem => menuItem);

  constructor() { }

  ngOnInit(): void {
  }

  goToCustomerLink()
  {
    window.open(environment.CUSTOMER_URL,"_blank");
  }

}


@NgModule({
  imports:[RouterModule,CommonModule],
  declarations:[SidebarComponent],
  exports:[SidebarComponent]
})

export class SidebarModule {}