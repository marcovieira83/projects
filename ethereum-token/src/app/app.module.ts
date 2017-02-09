import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import { AccountsComponent }  from './accounts.component';

@NgModule({
  declarations: [ AppComponent, AccountsComponent ],
  bootstrap:    [ AppComponent ],
  imports:      [ BrowserModule ]
})
export class AppModule {}
