import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FullComponent } from './layouts/full/full.component';
import { RouteGuardService } from './services/route-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'store',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/store/dashboard',
        pathMatch: 'full',
      },
      {
        path: '',
        loadChildren:
          () => import('./material-component/material.module').then(m => m.MaterialComponentsModule),

          //lorsque le path (/store/dashboard) est executé, on appel le service route-guard sur le methode canActivate en lui passsant en parametre 
          //la date expectedRole (admin et user), et verifier si l'utilisateur qui tente d'aller sur le dashboard est bien été authentifié et 
          //son role est admin ou user
          canActivate:[RouteGuardService],
          data:{
            expectedRole:['admin','user']
          }
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate:[RouteGuardService],
          data:{
            expectedRole:['admin','user']
          }
      }
    ]
  },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
