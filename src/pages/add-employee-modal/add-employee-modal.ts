import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { URLSearchParams } from '@angular/http' ;

import { CompanyProvider } from '../../providers/company/company';
import { EmployeeProvider } from '../../providers/employee/employee';
import { LoginPage } from '../login/login'; 


/**
 * Generated class for the AddEmployeeModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-add-employee-modal',
   templateUrl: 'add-employee-modal.html',
 })
 export class AddEmployeeModalPage {

   employeeData = { email: '', firstname:'', lastname:'', phone:'', company_id:''}
   imageURI:any;
   imageFileName:any;
   data:any;
   datas:any;
   empData:any;

   loading:any;

   token:any;

   constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl:ViewController,  private employee:EmployeeProvider,
     public loadingCtrl: LoadingController, public toastCtrl: ToastController, private storage:Storage) {
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad AddEmployeeModalPage');
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
       console.log('error');
       
       this.getCompany(this.token);
     });
   }

   saveForm()
   {
     if (this.employeeData.firstname && this.employeeData.lastname && this.employeeData.company_id && this.employeeData.email && this.employeeData.phone) { 
       this.showLoader();

       let urlSearchParams = new URLSearchParams();
       urlSearchParams.append('firstname', this.employeeData.firstname);
       urlSearchParams.append('lastname', this.employeeData.lastname);
       urlSearchParams.append('company_id', this.employeeData.company_id);
       urlSearchParams.append('email', this.employeeData.email);
       urlSearchParams.append('phone', this.employeeData.phone);

       console.log("url outside: "+ urlSearchParams);
       console.log("token outside:"+ this.token);
       
       this.employee.employeeSave(urlSearchParams, this.token).then((result) => {
         console.log("token inside save: " + this.token);
         console.log("url inside: "+ urlSearchParams);
         this.empData = result;
         console.log(this.empData);
         this.presentToast('Employee added succesfully');
         this.viewCtrl.dismiss();
         
       }, (err) => {
         this.loading.dismiss();
         console.log(err);
         
         this.presentToast("Error: "+err);
       })

     } else {
       this.presentToast('All fields are required');
     }
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

   showLoader(){
     this.loading = this.loadingCtrl.create({
       content: 'Uploading...'
     });

     this.loading.present();
   }


   getCompany(token){
     this.showLoader();
     this.employee.getCompanies(token).subscribe(result => {
       this.loading.dismiss();
       if (result.status == 200) { 
         this.datas = result.data;
         console.log(this.datas);
       } 
     }, (err) => {
       this.loading.dismiss();
       this.presentToast("Error: "+ err);
     });
   }

 }
