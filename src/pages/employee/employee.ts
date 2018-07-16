import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ToastController , LoadingController, AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { SingleEmployeePage } from '../single-employee/single-employee';

import { AddEmployeeModalPage } from '../add-employee-modal/add-employee-modal';
import { EmployeeProvider } from '../../providers/employee/employee';

/**
 * Generated class for the EmployeePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-employee',
   templateUrl: 'employee.html',
 })
 export class EmployeePage {
   token:any;
   loading: any;
   data:any = [];
   datas:any =[];

   constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private alert:AlertController,
     private storage: Storage, private toast:ToastController, private loader:LoadingController, private emp: EmployeeProvider) {
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad EmployeePage');
   }

   addfab(){
     let addModal = this.modalCtrl.create(AddEmployeeModalPage);
     addModal.present();
     console.log('fab clicked');

   }

   ionViewWillEnter()
   {
     this.storage.get('token').then((val) => {
       if (val != null) { 
         this.token = JSON.parse(val);
       } else {
         this.navCtrl.setRoot(LoginPage);
       }
       console.log('eror');
       
       this.getEmployee(this.token);
     });
   }
   
   getEmployee(token)
   {
     this.showLoader();
     this.emp.getEmployee(token).subscribe(result => {
       this.loading.dismiss();       

       if (result.status == 200) { 
         this.data = result.data.data;
         console.log(this.data);

       }
     }, (err) => {
       this.loading.dismiss();
       this.presentToast("Error: "+ err);
     });
   }

   presentToast(msg) {
     let toast = this.toast.create({
       message: msg,
       duration: 3000
     });

     toast.onDidDismiss(() => {
       console.log('Dismissed toast');
     });

     toast.present();
   }

   showLoader(){
     this.loading = this.loader.create({
       content: 'please wait...'
     });

     this.loading.present();
   }

   viewSingle(id){
     console.log(id);
     
     this.emp.getSingleEmployee(id, this.token).subscribe(result => {

       if (result.status == 200) { 
         this.datas = result.data;
         console.log(this.datas);

         this.showConfirm(id, this.datas.firstname, this.datas.lastname);
         
       }
     });
     
   }

   showConfirm(id, firstname, lastname) {
     const confirm = this.alert.create({
       title: firstname,
       message: lastname,
       buttons: [
       {
         text: 'Delete',
         handler: () => {
           console.log('Disagree clicked');
           this.delete(id);
         }
       },
       {
         text: 'Edit',
         handler: () => {
           console.log('Agree clicked');
           this.navCtrl.push(SingleEmployeePage, {"id": id});
         }
       }
       ]
     });
     confirm.present();
   }

   updateEmp(){
     
   }

   delete(id){
     this.emp.delete(id, this.token).then((result) => {
       console.log('deleted');  
       this.getEmployee(this.token);

     });
   }
 }
