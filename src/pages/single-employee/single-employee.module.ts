import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleEmployeePage } from './single-employee';

@NgModule({
  declarations: [
    SingleEmployeePage,
  ],
  imports: [
    IonicPageModule.forChild(SingleEmployeePage),
  ],
})
export class SingleEmployeePageModule {}
