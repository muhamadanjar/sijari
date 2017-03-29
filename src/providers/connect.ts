import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class Connect {
  public rootUrl: string;
  constructor(public http: Http) {
    this.setUrl('http://192.168.20.8/api');
  }

  setUrl(url) {
    this.rootUrl = url;
  }
  getUrl() {
    return this.rootUrl;   
  }
}
