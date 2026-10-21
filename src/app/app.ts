import { Component } from '@angular/core';
import { Carte } from './carte/carte';

@Component({
  selector: 'app-root',
  imports: [Carte],
  template: '<app-carte />',
})
export class App {}
