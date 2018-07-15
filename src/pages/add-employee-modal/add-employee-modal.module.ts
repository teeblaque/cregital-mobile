import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddEmployeeModalPage } from './add-employee-modal';

@NgModule({
  declarations: [
    AddEmployeeModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddEmployeeModalPage),
  ],
})
export class AddEmployeeModalPageModule {}
