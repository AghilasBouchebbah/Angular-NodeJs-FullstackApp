import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router:Router) { }

  public isAuthenticated(): boolean {
    //on recupere le token stoké dans localstorage lors de login
    const token = localStorage.getItem('token');


    //si le token n'est pas valide, il sera rediriger vers la home page (connexion) et renvoi false
    if(!token){
      this.router.navigate(["/"]);
      return false;
    }
    //sinon il continue sa navigation, et on renvoi true
    else{
      return true;
    }
  }
}
