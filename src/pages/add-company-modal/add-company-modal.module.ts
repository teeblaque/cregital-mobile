import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCompanyModalPage } from './add-company-modal';

@NgModule({
  declarations: [
    AddCompanyModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddCompanyModalPage),
  ],
})
export class AddCompanyModalPageModule {}
