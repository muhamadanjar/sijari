import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

export class User {
  name: string;
  email: string;
 
  constructor(name: string, email: string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class Auth {
  public token: any;
  url:any;
  currentUser: User;
  constructor(public http: Http, public storage: Storage) {
    console.log('Hello Auth Provider');
    this.url = "http://192.168.20.8/api";
  }

  login(credentials){
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        // At this point make a request to your backend to make a real check!
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post(this.url+'/login', JSON.stringify(credentials), {headers: headers}) .subscribe(res => {
              let data = res.json();
              console.log(data);
              
              this.token = data.token;
              this.storage.set('token', data.token);
              
              if(data.data){
                this.currentUser = new User(data.data.name, data.data.email);
                this.storage.set('currentUser', this.currentUser);
              }
              observer.next(data.status);
              observer.complete();
        });
      });
    }
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

  checkAuthentication(){
   return Observable.create(observer => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.get(this.url+'/checklogin', {headers: headers}) .subscribe(res => {
        let data = res.json();
        console.log(data);
        observer.next(data.status);
        observer.complete();
      });
     
    });
 
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

}
