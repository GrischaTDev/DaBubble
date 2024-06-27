import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobileLoginComponent } from "./login/mobile-login/mobile-login.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, MobileLoginComponent]
})
export class AppComponent {
  title = 'da-bubble';
}
