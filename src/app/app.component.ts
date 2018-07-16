import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
// import { Network } from '@ionic-native/network';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  token:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage, private alertCtrl: AlertController) {
    platform.ready().then(() => {
       // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }


    // check is user id exists in localstorage, if not set loginPage as rootPage
    ngAfterViewInit() {

      this.storage.get('token').then((val) => {
        if (val != null) {
          console.log(val);
          this.token = JSON.parse(val);
        } else {
          this.rootPage = LoginPage;
        }
        this.getPage(this.token);
      });
    }

    presentAlert(title, msg) {
      let alert = this.alertCtrl.create({
        title: title,
        subTitle: msg,
        buttons: ['Dismiss']
      });
      alert.present();
    }

    getPage(token){
      if (token) { 
        this.rootPage = TabsPage;
      }  
    }

  }
