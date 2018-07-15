import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Headers, Http, RequestOptions } from "@angular/http";
import { HttpClient } from '@angular/common/http';

/*
  Generated class for the EmployeeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
  */
  @Injectable()
  export class EmployeeProvider {
  	url;

  	private headers = new Headers();
  	private headers_formdata: Headers = new Headers({'Content-Type': undefined});

  	constructor(public http: Http) {
  		console.log('Hello CompanyProvider Provider');
  		this.url = 'http://localhost:8000/api';
  	}

  	saveEmployee(token, credentials)
  	{
      const listPubVal: string = 'Bearer ' + token;
      this.headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
      this.headers.append('Authorization', listPubVal);

      return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Accept', 'application/json');

        let options = new RequestOptions({ headers: headers });

        this.http.post(this.url+'/employee/create', credentials, options)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
      });
    }

    employeeSave(credentials, token)
    {
      const toks: string = 'Bearer ' + token;
      this.headers.append('Authorization', toks);

       return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let options = new RequestOptions({ headers: headers });

        this.http.post(this.url+'/employee/create', credentials, options)
          .subscribe(res => {
            resolve(res.json());
          }, (err) => {
            reject(err);
          });
    });
    }

    getEmployee(token)
    {
      const listPubVal: string = 'Bearer ' + token;
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.headers.append('Authorization', listPubVal);

      return this.http.get(this.url+'/employee', {headers: this.headers})
      .map(res => res.json(), (err) => {
        console.log('could not connect to database');
      });
    }

    getSingleEmployee(id, token)
    {
      const listPubVal: string = 'Bearer ' + token;
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.headers.append('Authorization', listPubVal);

      return this.http.get(this.url+'/employee/single/'+id, {headers: this.headers})
      .map(res => res.json(), (err) => {
        console.log('could not connect to database');
      });
    }

    delete(id, token)
    {
      const listPubVal: string = 'Bearer ' + token;
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.headers.append('Authorization', listPubVal);

      return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Accept', 'application/json');

        let options = new RequestOptions({ headers: headers });

        this.http.delete(this.url+'/employee/delete/'+id, options)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
      });
    }

    editEmp(id, token)
    {
      const listPubVal: string = 'Bearer ' + token;
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.headers.append('Authorization', listPubVal);

      return this.http.get(this.url+'/employee/single-edit/'+id, {headers: this.headers})
      .map(res => res.json(), (err) => {
        console.log('could not connect to database');
      });
    }

    updateEmp(id, token, credentials)
    {
      const listPubVal: string = 'Bearer ' + token;
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.headers.append('Authorization', listPubVal);

      return new Promise((resolve, reject) => {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        this.headers.append('Authorization', listPubVal);

        let options = new RequestOptions({ headers: headers });

        this.http.post(this.url+'/employee/updates/'+id, credentials, options)
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
      });
    }

    getCompanies(token)
    {
      const listPubVal: string = 'Bearer ' + token;
      this.headers = new Headers({'Content-Type': 'application/json'});
      this.headers.append('Authorization', listPubVal);

      return this.http.get(this.url+'/company', {headers: this.headers})
      .map(res => res.json(), (err) => {
        console.log('could not connect to database');
      });
    }

  }
