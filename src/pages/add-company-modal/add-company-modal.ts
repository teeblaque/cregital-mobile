import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { URLSearchParams } from '@angular/http' ;

import { CompanyProvider } from '../../providers/company/company';
import { EmployeeProvider } from '../../providers/employee/employee';
import { LoginPage } from '../login/login'; 

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';


@IonicPage()
@Component({
  selector: 'page-add-company-modal',
  templateUrl: 'add-company-modal.html',
})
export class AddCompanyModalPage {

	companyData = { email: '', name:''}
  imageURI:any;
  imageFileName:any;
	
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController, private transfer: FileTransfer,
     private camera: Camera, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private company: CompanyProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCompanyModalPage');
  }

  dismiss(){
  	this.viewCtrl.dismiss();
  }

  saveForm(){}

   getImage() {
     const options: CameraOptions = {
       quality: 100,
       destinationType: this.camera.DestinationType.FILE_URI,
       sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
     }

     this.camera.getPicture(options).then((imageData) => {
       this.imageURI = imageData;
     }, (err) => {
       console.log(err);
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

}
