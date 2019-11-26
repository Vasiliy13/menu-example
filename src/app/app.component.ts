import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public menuWidth = 200;
  public waveWidth = 40;
  public openDuration = 0.8;
  public contentMargin = 10;

  public openMenu = false;
  public formatFunc = (value) => value + 's';

  constructor() {
  }

  public toggle(): void {
    this.openMenu = !this.openMenu;
  }
}
