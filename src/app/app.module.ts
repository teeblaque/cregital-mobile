import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { MyApp } from './app.component';

import { CompanyPage } from '../pages/company/company';
import { EmployeePage } from '../pages/employee/employee';
import { SettingsPage } from '../pages/settings/settings';
import { LoginPage } from '../pages/login/login';
import { AddCompanyModalPage } from '../pages/add-company-modal/add-company-modal';
import { AddEmployeeModalPage } from '../pages/add-employee-modal/add-employee-modal';
import { SingleCompanyPage } from '../pages/single-company/single-company';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { CompanyProvider } from '../providers/company/company';
import { EmployeeProvider } from '../providers/employee/employee';

@NgModule({
  declarations: [
    MyApp,
    SettingsPage,
    CompanyPage,
    EmployeePage,
    AddCompanyModalPage,
    AddEmployeeModalPage,
    SingleCompanyPage,
    LoginPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingsPage,
    CompanyPage,
    EmployeePage,
    AddCompanyModalPage,
    AddEmployeeModalPage,
    SingleCompanyPage,
    LoginPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    CompanyProvider,
    EmployeeProvider,
    SingleCompanyPage,
    FileTransfer,
    FileTransferObject,
    File,
    Camera
  ]
})
export class AppModule {}
