import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { URLSearchParams } from '@angular/http' ;

import { AuthProvider } from '../../providers/auth/auth';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
   selector: 'page-login',
   templateUrl: 'login.html',
 })
 export class LoginPage {

   loginData = { email: '', password:''}
   loading:any;
   data:any;

   constructor(public navCtrl: NavController, public navParams: NavParams, public storage:Storage, private auth: AuthProvider, private loader: LoadingController, private toast: ToastController) {
   }

   ionViewDidLoad() {
     console.log('ionViewDidLoad LoginPage');
   }

   saveForm()
   {
     if (this.loginData.email && this.loginData.password) { 
       
       this.showLoader();
       let urlSearchParams = new URLSearchParams();
       urlSearchParams.append('email', this.loginData.email);
       urlSearchParams.append('password', this.loginData.password);

       this.auth.login(urlSearchParams).then((result) => {
         this.loading.dismiss();
         this.data = result;
         console.log(this.data);

         this.navCtrl.setRoot(TabsPage);

         if (this.data.success.status == 200) { 
             this.storage.set('token', JSON.stringify(this.data.success.token));
             this.storage.set('email', JSON.stringify(this.data.success.email));

         } 
         
       }, (err) => {
         this.loading.dismiss();
           console.log(err);
           this.presentToast('Error!!!' + err);
       });

     } else {
        console.log('All Credential are required');
       this.presentToast('Email and Password field cannot be null');
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

  showLoader(){
    this.loading = this.loader.create({
      content: 'authenticating...'
    });

    this.loading.present();
  }
}
