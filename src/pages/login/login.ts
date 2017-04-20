import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController,AlertController } from 'ionic-angular';
import {Auth} from '../../providers/auth';
import { Http } from '@angular/http';
import {PoiPage} from '../poi/poi';
import {FbPage} from '../fb/fb';
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  username: string;
  password: string;
  loading: any;
  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  public alertCtrl: AlertController,
  public loadingCtrl:LoadingController,
  public authService:Auth,
  public http:Http
  ) {
    /*authService.checkAuthentication().subscribe(allowed => {        
      console.log('amkar');
      
        if (allowed) {
          navCtrl.setRoot(PoiPage);
        }
      }, (err) => {
            console.log("Not already authorized",err);
            //this.loading.dismiss();
    });*/
    authService.checkAuthentication().subscribe(data => {
      console.log(data.status);
        if(data.status){
          navCtrl.setRoot(FbPage);
        }
    });
    
    
  }

  ionViewDidLoad() {
    
  }
  ngAfterViewInit() {
    
  }

  login(){
    this.showLoader();
    let credentials = {
      username: this.username,
      password: this.password
    }; let t = this;
    this.authService.login(credentials).subscribe(allowed => {
        if (allowed) {
            setTimeout(() => {
            t.loading.dismiss();
            t.navCtrl.setRoot(FbPage)
            });
        } else {
            t.showError("Akses ditolak");
        }
    },error => {
        t.showError(error);
    });
  }
  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });
 
    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  showLoader(){
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating...'
    });
    this.loading.present();
  }

}
