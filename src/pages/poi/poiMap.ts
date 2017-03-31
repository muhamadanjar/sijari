import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController,ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { PoiPage } from './poi';
import { Storage } from '@ionic/storage';
import { DataFasilitas } from '../../providers/poipandeglang';
import { Connect } from '../../providers/connect';
declare var google:any;
var map:any;
var markers = [];


@Component({
  selector: 'page-poilocatemap',
  template:  `<ion-header>
    <ion-navbar color="primary">
      <ion-title>
        Lokasi Peta
      </ion-title>
      
    </ion-navbar>
    </ion-header>
    <ion-content>
      <div #map id="map"></div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        
        <ion-buttons>
          <ion-grid text-center>
            <ion-row>
              <ion-col><button ion-button icon-left block (click)="goBack()" type="button"> Kembali</button></ion-col>
              <ion-col><button ion-button icon-left block (click)="getRefresh()" type="button"> Refresh</button></ion-col>
              <ion-col><button ion-button icon-left block (click)="getLocate()" type="button"> Locate</button></ion-col>
            </ion-row>
          </ion-grid>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  `
})
export class PoiMapLocatePage {
  public data:any;
  constructor(
    public navparams: NavParams,
    public navCtrl : NavController,
    public storage: Storage,
    public geolocation:Geolocation,
    public platform: Platform) {
      this.data = navparams.data.data;
      console.log(this.data);
      
    }

  initializeMap() {
    this.platform.ready().then(() => {
        //var infowindow = new google.maps.InfoWindow();
        var minZoomLevel = 12;
        var pandeglangPoint = new google.maps.LatLng(-6.3252738,106.0764884);
        
        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: pandeglangPoint,
            zoom: minZoomLevel,
            mapTypeControl: false,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT
            },
            scaleControl: false,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            fullscreenControl: true
        });
        this.LoadExistData();

        
    });
  }
  ngAfterViewInit() {
    this.initializeMap();
  }

  goBack(){
    this.storage.set('datapoi',this.data);
    this.navCtrl.setRoot(PoiPage,{data:this.data});
  }
  getRefresh(){
    console.log('Get Refresh');
    this.deleteMarkers();
    
  }
  getLocate(){
    console.log('Get Locate');
    
    if(this.geolocation){
      this.data.gpsinfo = "Mencari Lokasi Peta....";
      this.geolocation.getCurrentPosition().then((position) => {
        this.data.x = position.coords.longitude;
        this.data.y = position.coords.latitude;
        this.data.gpsinfo = "latitude :"+this.data.y+" longitude :"+this.data.x;
        let latlngset = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			  let marker = new google.maps.Marker({  
            map: map, title: 'Lokasi Disini',
            position: latlngset,
            icon: 'assets/img/icon_map.png'
        });
        markers.push(marker);
      }, (err) => {
        console.log(err);
      });
    }
  }

  setCenter(latlng){
    map.setCenter({lat:latlng.lat, lng:latlng.lng});
  }

  setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
   }
   // Removes the markers from the map, but keeps them in the array.
   clearMarkers() {
      this.setMapOnAll(null);
   }

   deleteMarkers() {
      this.clearMarkers();
      markers = [];
   }

   LoadExistData(){
     if(this.data){
        var point = new google.maps.LatLng(this.data.y,this.data.x);
        var marker = new google.maps.Marker({  
              map: map, title: 'Lokasi Disini',
              position: point,
              icon: 'assets/img/icon_map.png'
        });
        map.setCenter(point);
        markers.push(marker);
     }
   }

}

@Component({
  selector: 'page-pinpoint',
  
  template:`<ion-content>
    <div #map id="map"></div>
  </ion-content>
  <ion-footer>
    <ion-grid text-center class="button-group">
        <ion-row>
          <ion-col class="col"><button ion-button icon-left block (click)="getSend()" type="button"> Kirim</button></ion-col>
          <ion-col class="col"><button ion-button icon-left block (click)="getCancel()" type="button"> Batal</button></ion-col>
        </ion-row>
    </ion-grid>
  </ion-footer>
  `
  
})
export class PinPointMapPage{
   data:any;

   constructor(
      public storage: Storage,
      public platform: Platform,
      public navparams: NavParams,
      public navCtrl:NavController
   ){
     this.data = navparams.data.data;
     //google.maps.event.addDomListener(window, 'load', initialize);
   }
   ngAfterViewInit() {
     this.initializeMap();
   }
   initializeMap() {
    this.platform.ready().then(() => {
        //var infowindow = new google.maps.InfoWindow();
        var minZoomLevel = 12;
        var pandeglangPoint = new google.maps.LatLng(-6.3252738,106.0764884);
        
        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: pandeglangPoint,
            zoom: minZoomLevel,
            mapTypeControl: false,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT
            },
            scaleControl: false,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            fullscreenControl: true
        });

        let t = this;
        google.maps.event.addListener(map, 'click', (event) => {
            t.addMarker(event.latLng);
        });

        
    });
   }
   addMarker(latlng, i=0) {
     this.clearMarkers();
     
     var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        draggable: true,
        icon: 'assets/img/icon_map.png'
     });
     this.data.x = latlng.lng();
     this.data.y = latlng.lat();
     markers.push(marker);
   }
   // Sets the map on all markers in the array.
   setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
   }
   // Removes the markers from the map, but keeps them in the array.
   clearMarkers() {
      this.setMapOnAll(null);
   }
   // Shows any markers currently in the array.
   showMarkers() {
      this.setMapOnAll(map);
   }
   // Deletes all markers in the array by removing references to them.
   deleteMarkers() {
      this.clearMarkers();
      markers = [];
   }
   /*displayMarkers() {
        markers = [];
        var countjson = markers.length;
        var last_index = countjson - 1;
        for (var i = 0; i < markers.length; i++) {
            var latlng = markers[i].getPosition();
            this.txt += latlng.toUrlValue() + ",\n";
            polylineStore.push(latlng.toJSON());
        }
   }*/
   getSend(){
      this.navCtrl.setRoot(PoiPage,{data:this.data});
   }
   getCancel(){
      this.navCtrl.pop();
   }
}

@Component({
  selector: 'page-poimap',
  template:`
  <ion-header>
    <ion-navbar color="primary">
      <ion-title>
        Lihat Peta
      </ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content>
    <div #map id="map"></div>
  </ion-content>
  `
})
export class PoiMapPage{
  markers: Array<{}>;
  marker:Array<{}>;
  constructor(
      public storage: Storage,
      public df: DataFasilitas,
      public platform: Platform,
      public navparams: NavParams,
      public navCtrl:NavController,
      public modalCtrl:ModalController
  ){}
  initializeMap() {
    this.platform.ready().then(() => {
        //var infowindow = new google.maps.InfoWindow();
        var minZoomLevel = 12;
        var pandeglangPoint = new google.maps.LatLng(-6.3252738,106.0764884);
        
        map = new google.maps.Map(document.getElementById('map'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: pandeglangPoint,
            zoom: minZoomLevel,
            mapTypeControl: false,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_CENTER
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.TOP_LEFT
            },
            scaleControl: false,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            fullscreenControl: true
        });
        this.LoadPoi();

        
        
    });
  }
  ngAfterViewInit() {
    this.initializeMap();
    
  }

  addMarker(latlng, data) {
     let marker;
     marker = new google.maps.Marker({
        map: map,
        position: latlng,
        draggable: false,
        icon:'assets/img/icon_map.png',
        id:data.id
        
     });
     let t = this;
     google.maps.event.addListener(marker, "click", function () {
        console.log(this.id);
        t.openModal({poi:data});
     });
     
     markers.push(marker);
   }

  LoadPoi(){
    this.df.LoadFasilitas().subscribe(
      data => {
            console.log(data);
            for(let i =0;i< data.length;i++){
                let point = new google.maps.LatLng(data[i].y,data[i].x);
                this.addMarker(point,data[i]);
            }
            
      },err => {
        console.log(err);
    });
  }

  setMapOnAll(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
   }
   // Removes the markers from the map, but keeps them in the array.
   clearMarkers() {
      this.setMapOnAll(null);
   }
   // Shows any markers currently in the array.
   showMarkers() {
      this.setMapOnAll(map);
   }
   // Deletes all markers in the array by removing references to them.
   deleteMarkers() {
      this.clearMarkers();
      markers = [];
   }

   openModal(characterNum) {
    let modal = this.modalCtrl.create(ModalPoiMap, characterNum);
    modal.present();
  }
}

@Component({
  template:`
  <ion-header>
    <ion-toolbar>
      <ion-title>
        Description
      </ion-title>
      <ion-buttons start>
        <button ion-button (click)="dismiss()">
          <span ion-text color="primary" showWhen="ios">Cancel</span>
          <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-list>
        <ion-item>
          <ion-avatar item-left>
            <img src="{{url}}/images/poi/{{poi.foto}}">
          </ion-avatar>
          <h2>{{poi.daerah_irigasi}}</h2>
          <p>{{poi.jaringan_irigasi}}</p>
        </ion-item>
        
        <ion-item>
          Bendung
          <ion-note item-right>
            {{poi.bendung}}
          </ion-note>
        </ion-item>

        <ion-item>
          Saluran Primer
          <ion-note item-right>
            {{poi.saluran_primer}}
          </ion-note>
        </ion-item>

        <ion-item>
          Drain Inlet
          <ion-note item-right>
            {{poi.drain_inlet}}
          </ion-note>
        </ion-item>

        <ion-item>
          Saluran Sekunder
          <ion-note item-right>
            {{poi.saluran_sekunder}}
          </ion-note>
        </ion-item>

        <ion-item>
          Kondisi
          <ion-note item-right>
            {{poi.kondisi}}
          </ion-note>
        </ion-item>

        <ion-card>
          <img src="{{url}}/images/poi/{{poi.foto}}">
        </ion-card>
        
        
    </ion-list>
  </ion-content>
  `
})
export class ModalPoiMap{
  poi;
  url;
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public connect: Connect
  ) {
    connect.setUrl('http://192.168.20.8');
    this.url = connect.rootUrl;
    this.poi = params.data.poi;
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
