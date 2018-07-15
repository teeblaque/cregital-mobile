import { Component } from '@angular/core';
import { Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Network } from '@ionic-native/network';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  public online:boolean = true;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage, private network: Network, private alertCtrl: AlertController) {
    platform.ready().then(() => {
      let type = this.network.type;

      console.log("Connection type: ", type);

      if (type == 'unknown' || type == "none" || type == undefined) { 
        console.log("The device is not online");
        this.online = false;
        this.presentAlert('Network Error!!', 'Please connect your device to a network');

      }else{
        // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    }
  });
  }


    // check is user id exists in localstorage, if not set loginPage as rootPage
    ngAfterViewInit() {

      this.storage.get('token').then((val) => {
        if (val != null) {
          this.rootPage = TabsPage;
        } else {
          this.rootPage = LoginPage;
        }
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

  }
