import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { decode } from 'querystring';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import jwt_decode from "jwt-decode";
import { GlobalConstant } from '../shared/global-constants';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {

  constructor(public auth:AuthService,
    public router:Router,
    private snackbarService:SnackbarService) { }

    //recuperer les données du route  
    canActivate(route: ActivatedRouteSnapshot):boolean{
      let expectedRoleArray = route.data;
      expectedRoleArray = expectedRoleArray.expectedRole;
      //decoder le token qui dans le localstroage pour recuperer les données de connexion (payload)
      const token:any = localStorage.getItem('token');
      var tokenPayload:any;
      //si c'est ok
      try{
        tokenPayload = jwt_decode(token);
      }
      //sinon on clear tout
      catch(err){
        localStorage.clear();
        this.router.navigate(['/']);
      }

      let checkRole =false;

      for(let i=0;i<expectedRoleArray.length;i++){
        if(expectedRoleArray[i] == tokenPayload.role){
          checkRole=true;
        }
      }

      //vérifier le role de l'utilisateur si il est "user" ou "admin", car que l'admin peut faire les operations
      if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
        if(this.auth.isAuthenticated() && checkRole){
          return true;
        }
        else{

        //si il n'est pas authentifié ou que le role n'est pas user ou admin
        this.snackbarService.openSnackBar(GlobalConstant.unauthorized,GlobalConstant.error);
        this.router.navigate(['/store/dashboard']);
        console.log('message false');
        return false
        }
      }
      else{
        this.router.navigate(['/']);
        localStorage.clear();
        return false;
      }


    }
}
