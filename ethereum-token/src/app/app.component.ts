import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <h2>Accounts</h2>
    <accounts></accounts>
  `
})
export class AppComponent {
  title = 'My Token';
}
