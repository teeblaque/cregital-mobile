import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Platform, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AddCompanyModalPage } from '../add-company-modal/add-company-modal';
import { SingleCompanyPage } from '../single-company/single-company';
import { LoginPage } from '../login/login';

import { CompanyProvider } from '../../providers/company/company';

/**
 * Generated class for the CompanyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @IonicPage()
 @Component({
 	selector: 'page-company',
 	templateUrl: 'company.html',
 })
 export class CompanyPage {

 	token:any;
 	data:any =[];
 	loading:any;
 	pix_url:any;
 	datas: any;

 	constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private storage: Storage, 
 		private company: CompanyProvider, private toast: ToastController, private loader: LoadingController, private alert: AlertController) {
 	}

 	ionViewDidLoad() {
 		console.log('ionViewDidLoad CompanyPage');
 	}

 	addfab(){
 		let addModal = this.modalCtrl.create(AddCompanyModalPage);
 		addModal.present();
 		console.log('fab clicked');

 	}

 	ionViewWillEnter(){
 		
 		this.storage.get('token').then((val) => {
 			if (val != null) { 
 				this.token = JSON.parse(val);
 			} else {
 				this.navCtrl.setRoot(LoginPage);
 			}

 			this.getCompany(this.token);
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
 		this.company.getSingleCompany(id, this.token).subscribe(result => {
 			console.log(result);
 			this.datas = result.data;

 			this.showConfirm(this.datas.id, this.datas.name, this.datas.email);
 		});
 		
 	}

 	showConfirm(id, name, email) {
 		const confirm = this.alert.create({
 			title: name,
 			message: email,
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
 					this.navCtrl.push(SingleCompanyPage, {"id": id});
 				}
 			}
 			]
 		});
 		confirm.present();
 	}

 	delete(id){
 		this.company.delete(id, this.token).then((result) => {
 			console.log('deleted');	
 			this.getCompany(this.token);

 		});
 	}

 	getCompany(token){
 		this.showLoader();
 		this.company.getCompanies(token).subscribe(result => {
 			this.loading.dismiss();
 			
 			
 			if (result.status == 200) { 
 				this.pix_url="http://cregital.cleanritemaintenanceservices.com.ng/logo/";
 				this.data = result.data.data;
 				console.log(this.data);

 			}
 		}, (err) => {
 			this.loading.dismiss();
 			this.presentToast("Error: "+ err);
 		});
 	}
 	
 }

