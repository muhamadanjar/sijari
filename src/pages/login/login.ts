import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController,AlertController } from 'ionic-angular';
import {Auth} from '../../providers/auth';
//import {HomePage} from '../home/home';
//import {TabPage} from '../tab/tab';
import {PoiPage} from '../poi/poi';
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
  public authService:Auth) {
    
  }

  ionViewDidLoad() {
    this.authService.checkAuthentication().subscribe(allowed => {
        if (allowed) {
          setTimeout(() => {
            //this.loading.dismiss();
            this.navCtrl.setRoot(PoiPage)
          });
        }else{
            //this.loading.dismiss();
        }
      }, (err) => {
            console.log("Not already authorized",err);
            //this.loading.dismiss();
      });
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
            t.navCtrl.setRoot(PoiPage)
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
