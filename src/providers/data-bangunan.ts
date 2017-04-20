import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the DataBangunan provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataBangunan {
  rootUrl;
  constructor(public http: Http) {
    //console.log('Hello DataFasilitas Provider');
    this.rootUrl = 'http://192.168.20.8/api';
  }

  InsertPostBangunan(data){
    var url = this.rootUrl+'/bangunan/insert';
    var response = this.http.post(url,data).map(res => res.json());
    return response;
  }

}
