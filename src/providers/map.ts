import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Platform } from 'ionic-angular';

declare var google:any;
var map:any;
var markers = [];

@Injectable()
export class Map {
  map:any;
  markers:any = [];
  constructor(public http: Http,
  public platform: Platform) {}

  initializeMap() {
    this.platform.ready().then(() => {
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

  
}
