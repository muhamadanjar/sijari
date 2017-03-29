import { Component } from '@angular/core';

import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tab.html'
})
export class TabPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  constructor() {}
}
