import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { $ } from 'protractor';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

// injectable à ajouter dans le provider de app.modules
@Injectable()
export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor(private router:Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    if(token){
      request = request.clone({
        setHeaders:{Authorization: `Bearer ${token}`}
      });
    }
    return next.handle(request).pipe(
      catchError((err)=>{
        if(err instanceof HttpErrorResponse){
          console.log(err.url);

          //reponses du backend lors de check authentification (verificattion du token passé dans le header)
          if(err.status === 401 || err.status === 403){
            if(this.router.url === '/'){}
            else{
              localStorage.clear();
              this.router.navigate(['/']);
            }
          }
        }
        return throwError(err);
      })
    );
  }
}
