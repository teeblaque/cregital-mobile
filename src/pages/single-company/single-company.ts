import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SingleCompanyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-single-company',
  templateUrl: 'single-company.html',
})
export class SingleCompanyPage {
	companyData:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.companyData = this.navParams.get('id');
  	console.log('single: '+ this.companyData);
  	
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingleCompanyPage');
  }

}
