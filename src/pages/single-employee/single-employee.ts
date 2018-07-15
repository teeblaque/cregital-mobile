import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { TabsPage } from '../tabs/tabs';

import { EmployeeProvider } from '../../providers/employee/employee';

/**
 * Generated class for the SingleEmployeePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-single-employee',
  templateUrl: 'single-employee.html',
})
export class SingleEmployeePage {

	empData:any;
	token:any;
	loading:any;
	employeeData = { email: '', firstname:'', lastname:'', phone:'', company_id:''}

  constructor(public navCtrl: NavController, public navParams: NavParams, private employee: EmployeeProvider, private storage:Storage, private toast:ToastController,
  	private loader:LoadingController) {
  	this.empData = this.navParams.get('id');
  	console.log('single: '+ this.employeeData);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleEmployeePage');
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
       
       this.getSingle(this.empData, this.token);
     });
  }

  getSingle(id, token)
  {
  	this.showLoader("Please wait...");
  	this.employee.editEmp(id, token).subscribe(result => {
  		this.employeeData = result;
  		console.log(this.employeeData);
  		
  	}, (err) => {
  		console.log(err);
  		this.presentToast("Error: " + err);
  	});
  }

  updateForm(){
  	if (this.employeeData.firstname && this.employeeData.lastname && this.employeeData.company_id && this.employeeData.email && this.employeeData.phone) { 
       this.showLoader("updating data...");

       let urlSearchParams = new URLSearchParams();
       urlSearchParams.append('firstname', this.employeeData.firstname);
       urlSearchParams.append('lastname', this.employeeData.lastname);
       urlSearchParams.append('company_id', this.employeeData.company_id);
       urlSearchParams.append('email', this.employeeData.email);
       urlSearchParams.append('phone', this.employeeData.phone);

       console.log("url outside: "+ urlSearchParams);
       console.log("token outside:"+ this.token);
       
       this.employee.updateEmp(this.empData, this.token, urlSearchParams).then((result) => {
         console.log("token inside save: " + this.token);
         console.log("url inside: "+ urlSearchParams);
         this.empData = result;
         console.log(this.empData);
         this.presentToast('Employee updated succesfully');
         this.navCtrl.push(TabsPage);
         
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
     let toast = this.toast.create({
       message: msg,
       duration: 3000
     });

     toast.onDidDismiss(() => {
       console.log('Dismissed toast');
     });

     toast.present();
   }

   showLoader(content){
     this.loading = this.loader.create({
       content: content
     });

     this.loading.present();
   }

}
