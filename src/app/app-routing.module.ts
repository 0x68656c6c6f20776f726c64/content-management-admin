import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/components/home/home.component';
import { LoginComponent } from 'src/components/login/login.component';
import { AuthGuard } from './auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { LayoutRoutes } from './layout/layout.routing';
import { NotFoundComponent } from 'src/components/not-found/not-found.component';


export const routes: Routes = [
  {
    path:'admin',
    loadChildren:()=>import('./layout/layout.module')
    .then(m=>m.AdminLayoutModule)
  },//,canActivate: [AuthGuard] },
  { path: '', redirectTo:'admin/home',pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: '**', component:NotFoundComponent}
];

// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })

// export class AppRoutingModule { }
