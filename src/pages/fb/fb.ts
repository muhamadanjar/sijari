import { Component } from '@angular/core';
import { NavController, NavParams,ToastController, ActionSheetController, Platform, Loading, LoadingController,PopoverController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';

import {DataBangunan} from "../../providers/data-bangunan";
import {FbMapPage, FbMapLocatePage, FbPinPointMapPage } from "./fbMap";


import { Storage } from '@ionic/storage';
import { Auth } from '../../providers/auth';
import { Connect } from '../../providers/connect';
declare var cordova: any;
@Component({
  selector: 'page-fb',
  templateUrl: 'fb.html',
  providers:[Camera,File,Transfer,FilePath]
})

export class FbPage {
  x:any;
  y:any;
  public data:any;
  results: Array<any>;

  lastImage: string = null;
  loading: Loading;
  username: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public loadingCtrl: LoadingController,  
    public popoverCtrl: PopoverController,
    public dtfasilitas: DataBangunan,
    public storage: Storage,
    public auth: Auth,
    public geolocation:Geolocation,
    private camera: Camera,
    private file: File,
    private filePath: FilePath,
    private transfer: Transfer,
    public connect: Connect) {
	  	this.data = {};
	    if(this.navParams.data.data != null){
	      this.data = this.navParams.data.data;
	    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FbPage');
  }

  geolocate(){
    if(this.geolocation){
      this.data.gpsinfo = "Mencari Lokasi....";
      this.geolocation.getCurrentPosition().then((position) => {
        this.x = position.coords.longitude;
        this.y = position.coords.latitude;
        this.data.x = this.x;
        this.data.y = this.y;
        this.data.gpsinfo = "latitude : "+this.y+" longitude : "+this.x;
        
      }, (err) => {
        console.log(err);
      });
    }
  }

  
  submit(){
     this.presentToast();
     let data = JSON.stringify({
          fungsi_bangunan:this.data.fungsi_bangunan,
          bangunan:this.data.bangunan,
          jumlah_lantai:this.data.jumlah_lantai,
          tipe_bangunan:this.data.tipe_bangunan,
          x:this.data.x,
          y:this.data.y,
          foto:this.data.foto
     });
     console.log(data);
     this.dtfasilitas.InsertPostBangunan(data).subscribe(data => {
          this.results = data;
          console.log(data);
          if(this.results[0].result =="success"){
            this.navCtrl.setRoot(FbPage);
          }
      }, error => {
            console.log("Oooops!");
      });
  }

  presentToast(text:string = 'Tunggu Sebentar') {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000
    });
    toast.present();
  }

  //Upload Foto
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Pilih Gambar',
      buttons: [
        {
          text: 'Ambil dari Librari',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Gunakan Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Batal',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType) {
	  // Create options for the Camera Dialog
	  var options = {
	    quality: 100,
	    sourceType: sourceType,
	    saveToPhotoAlbum: false,
	    correctOrientation: true
	  };
	 
	  // Get the data of an image
	  this.camera.getPicture(options).then((imagePath) => {
	    // Special handling for Android library
	    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
	      this.filePath.resolveNativePath(imagePath)
	      .then(filePath => {
	          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
	          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
	        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
	      });
	    } else {
	      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
	      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
	      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
	    }
	  }, (err) => {
	    this.presentToast('Error while selecting image.');
	  });
	}

  private createFileName() {
	  var d = new Date(),
	  n = d.getTime(),
	  newFileName =  n + ".jpg";
	  return newFileName;
	}

  // Copy the image to a local folder
	private copyFileToLocalDir(namePath, currentName, newFileName) {
	  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
	    this.lastImage = newFileName;
      this.data.foto = newFileName;
	  }, error => {
	    this.presentToast('Error while storing file.');
	  });
	}

  // Always get the accurate path to your apps folder
	public pathForImage(img) {
	  if (img === null) {
	    return '';
	  } else {
	    return cordova.file.dataDirectory + img;
	  }
	}

  public uploadImage() {
	  // Destination URL
    this.connect.setUrl('http://192.168.20.8');
	  var url = this.connect.rootUrl+"/php/upload.php";
	 
	  // File for Upload
	  var targetPath = this.pathForImage(this.lastImage);
	 
	  // File name only
	  var filename = this.lastImage;
	 
	  var options = {
	    fileKey: "file",
	    fileName: filename,
	    chunkedMode: false,
	    mimeType: "multipart/form-data",
	    params : {'fileName': filename}
	  };
	 
	  const fileTransfer: TransferObject = this.transfer.create();
	 
	  this.loading = this.loadingCtrl.create({
	    content: 'Uploading...',
	  });
	  this.loading.present();
	 
	  // Use the FileTransfer to upload the image
	  fileTransfer.upload(targetPath, url, options).then(data => {
	    this.loading.dismissAll()
	    this.presentToast('Image succesful uploaded.');
	  }, err => {
	    this.loading.dismissAll()
	    this.presentToast('Error while uploading file.');
	  });
	}

  public getLocateMap(){
    this.navCtrl.push(FbMapLocatePage,{data:this.data});
  }

  public getMapPin(){
    this.navCtrl.push(FbPinPointMapPage,{data:this.data});
  }

  presentPopoverMap(ev) {

    let popover = this.popoverCtrl.create(FbPopover);
    popover.present({
      ev: ev
    });
  }

}


@Component({
  template:`<ion-list>
      <button ion-item (click)="getAllMap()">Lihat Irigasi</button>
    </ion-list>`
})
export class FbPopover{
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ){}
  public getAllMap(){
    this.navCtrl.push(FbMapPage);
  }
}