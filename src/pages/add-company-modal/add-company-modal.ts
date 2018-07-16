import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ViewController, LoadingController, ToastController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { URLSearchParams } from '@angular/http' ;
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';
import { Observable } from 'rxjs/Observable';

import { Headers, Http, RequestOptions } from "@angular/http";

import { CompanyProvider } from '../../providers/company/company';
import { EmployeeProvider } from '../../providers/employee/employee';
import { LoginPage } from '../login/login'; 

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-add-company-modal',
  templateUrl: 'add-company-modal.html',
})
export class AddCompanyModalPage {

	companyData = { email: '', name:'', logo: ''}
  lastImage: string = null;
  loading:any;
  token:any;

  comData:any;

  imageURI:any;
  imageFileName:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController, private transfer: FileTransfer, private platform: Platform, private filePath: FilePath,
    private camera: Camera, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private company: CompanyProvider, 
    private actionSheetCtrl: ActionSheetController, private file: File, private storage:Storage, private http:Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCompanyModalPage');
  }

  dismiss(){
  	this.viewCtrl.dismiss();
  }

  ionViewWillEnter()
  {
    this.storage.get('token').then((val) => {
      if (val != null) { 
        this.token = JSON.parse(val);
      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    })
  }


  uploadFile() {
    this.showLoader();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let url = 'http://cregital.cleanritemaintenanceservices.com.ng/api/company/create';

    //File for Upload
    var targetPath = cordova.file.externalRootDirectory + this.imageURI; 

    // File name only
    var filename = targetPath.split("/").pop();

    let headers = new Headers();
    const listPubVal: string = 'Bearer ' + this.token;
    console.log('token in provider: '+ this.token);

    headers.append('Accept', 'application/json');
    headers.append('Authorization', listPubVal);

    let options: FileUploadOptions = {
      fileKey: 'ionicfile',
      fileName: 'ionicfile',
      chunkedMode: false,
      mimeType: "image/jpeg",
      params: {'name': this.companyData.name, 'email': this.companyData.email, 'logo': filename},
      headers: {headers: headers}
    }

    fileTransfer.upload(url, targetPath, options)
    .then((data) => {
      console.log(data+" Uploaded Successfully");
      this.loading.dismiss();
      this.presentToast("Image uploaded successfully");
    }, (err) => {
      console.log(err);
      this.loading.dismiss();
      this.presentToast(err);
    });
  }

  // saveForm()
  // {
  //   if (this.companyData.email && this.companyData.name) { 
  //     this.showLoader();

  //     let urlSearchParams = new URLSearchParams();
  //     urlSearchParams.append('name', this.companyData.name);
  //     urlSearchParams.append('email', this.companyData.email);
  //     urlSearchParams.append('logo', this.imageURI);

  //     this.company.companySave(this.token, urlSearchParams).then((result) =>{
  //       this.loading.dismiss();
  //       this.comData = result;
  //       console.log(this.comData);
  //       this.presentToast('Employee added succesfully');
  //     }, (err) => {
  //       this.loading.dismiss();
  //       alert(err);
  //       // this.presentToast('Error!!! ' + err);
  //     });

  //   } else {
  //     this.presentToast('All fields are required');
  //   }
  // }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
      {
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
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
        this.imageURI = imagePath;
      });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      this.imageURI = imagePath;
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}

// Create a new name for the image
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

showLoader(){
  this.loading = this.loadingCtrl.create({
    content: 'Uploading...'
  });

  this.loading.present();
}

}
