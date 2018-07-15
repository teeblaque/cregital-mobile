import { Component } from '@angular/core';

import { CompanyPage } from '../company/company';
import { EmployeePage } from '../employee/employee';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CompanyPage;
  tab2Root = EmployeePage;

  constructor() {

  }
}
