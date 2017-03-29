import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Datamembers provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataFasilitas {
  rootUrl;
  constructor(public http: Http) {
    console.log('Hello DataFasilitas Provider');
    this.rootUrl = 'http://192.168.20.8/api';
  }

  LoadFasilitas() {
    var url = this.rootUrl+'/fasilitas';
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

  InserFasilitas(firstname,lastename,email,mobile,city,state,country,postalcode){
    var url = 'http://nipc.esy.es/nip/backend/index.php?r=members/insert&firstname='+firstname+'&lastname='+lastename+'&email='+email+'&mobile='+mobile+'&city='+city+'&state='+state+'&country='+country+'&postalcode='+postalcode;
    var response = this.http.get(url).map(res => res.json());
    return response;
  }
  
  InsertPostFasilitas(data){
    var url = this.rootUrl+'/fasilitas/insert';
    var response = this.http.post(url,data).map(res => res.json());
    return response;
  }

  DeleteFasilitas(id){
    var url = this.rootUrl+'/deletefasilitas/'+id;
    var response = this.http.get(url).map(res => res.json());
    return response;

  }

  EditFasilitas(id,firstname,lastename,email,mobile,city,state,country,postalcode)
  {
    var url = 'http://nipc.esy.es/nip/backend/index.php?r=members/editmembers&firstname='+firstname+'&lastname='+lastename+'&email='+email+'&mobile='+mobile+'&city='+city+'&state='+state+'&country='+country+'&postalcode='+postalcode+'&id='+id;
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

  searchFasilitas(search) {
    var url = this.rootUrl+'/searchfasilitas/'+search ;
    var response = this.http.get(url).map(res => res.json());
    return response;
  }

}
