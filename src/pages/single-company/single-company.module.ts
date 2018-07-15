import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleCompanyPage } from './single-company';

@NgModule({
  declarations: [
    SingleCompanyPage,
  ],
  imports: [
    IonicPageModule.forChild(SingleCompanyPage),
  ],
})
export class SingleCompanyPageModule {}
