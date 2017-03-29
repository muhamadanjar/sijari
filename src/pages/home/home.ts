import {Component} from '@angular/core';
import {NavController,PopoverController,NavParams } from 'ionic-angular';
import { Auth } from '../../providers/auth';
import { DataFasilitas } from '../../providers/poipandeglang';
import { LoginPage } from '../login/login';
import { PoiPage } from '../poi/poi';
import { Geolocation } from '@ionic-native/geolocation';
@Component({
  template:`<ion-list>
      <button ion-item>Help</button>
    </ion-list>`
})
export class HomePopover {
  constructor(private navParams: NavParams) {}
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers:[DataFasilitas,Geolocation]
})
export class HomePage {
  username = '';
  email = '';
  slides = [
    {
      title: "Welcome to the Docs!",
      description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
      image: "assets/img/ica-slidebox-img-1.png",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "assets/img/ica-slidebox-img-2.png",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/img/ica-slidebox-img-3.png",
    }
  ];

  constructor(
    private nav: NavController, 
    private auth: Auth,
    private popoverCtrl: PopoverController) {
    let info = this.auth.getUserInfo();
    this.username = info.name;
    this.email = info.email;
  }
 
  public logout() {
    this.auth.logout().subscribe(succ => {
        this.nav.setRoot(LoginPage)
    });
  }

  presentPopover(ev) {

    let popover = this.popoverCtrl.create(HomePopover);
    popover.present({
      ev: ev
    });
  }

  getFormPoi(){
    this.nav.push(PoiPage);
  }
}