import { HttpClient } from '@angular/common/http';
import { Http, Headers,RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthProvider {
	url;

  constructor(public http: Http) {
    console.log('Hello AuthProvider Provider');
    this.url = 'http://cregital.cleanritemaintenanceservices.com.ng/api/login';
  }

  login(credentials) {
      return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        
        let options = new RequestOptions({ headers: headers });
        
        this.http.post(this.url, credentials, options)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
      });
    }

}
