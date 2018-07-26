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

  header:any;

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
    });
  }

  buildHeadersDeals(){
    this.header = new Headers();
    this.header.append('Authorization', 'bearer ' + this.token);
  }

  selectImage(selection: any) {
    var options: any;

    options = {
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: selection,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,     
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then((imgUrl) => {

      if (options.destinationType == this.camera.DestinationType.FILE_URI) {
        console.log(imgUrl,'if');
        var sourceDirectory = imgUrl.substring(0, imgUrl.lastIndexOf('/') + 1);
        var sourceFileName = imgUrl.substring(imgUrl.lastIndexOf('/') + 1, imgUrl.length);
        sourceFileName = sourceFileName.split('?').shift();
        this.file.copyFile(sourceDirectory, sourceFileName, cordova.file.externalApplicationStorageDirectory, sourceFileName).then((result: any) => {
          this.imageFileName = result.nativeURL;

      // do api call here

    }, (err) => {
      console.log(JSON.stringify(err));
    })
      }
      else {
        console.log(imgUrl,'else');
        this.imageFileName = "data:image/jpeg;base64," + imgUrl;
    //do here 
  }
}, (err) => {
  console.log("Error in choosing image :" + JSON.stringify(err));
});

  }


  uploadFile() {
    this.showLoader();
    const fileTransfer: FileTransferObject = this.transfer.create();
    let url = 'http://localhost:8000/api/company/create';

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
