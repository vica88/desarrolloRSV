import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;

console.log(currentUser.token)

        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    'RSV-SERVICE': "Bearer eyJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJSU1YtU0VSVklDRSIsInN1YiI6ImNvbnRyb2xyc3YiLCJpYXQiOjE1NzA2NDg4NjUsImV4cCI6MTU3MDczNTI2NX0.TJRA25l6kBRXuTRiLlVa8csOgIKlHk0xTZ4jzS_0l7PRvd6FyxCjQ8r5vfzdiP-oNfG97rMuoXh9RVEcI2Z_YA"
                    //`Bearer ${currentUser.token}`
                },
                withCredentials : true // Necesario para compatibilidad con Symfony
            });
        }

        return next.handle(request);
    }
}