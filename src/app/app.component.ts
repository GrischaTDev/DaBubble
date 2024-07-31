import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { LoginComponent } from "./login/login/login.component";
import { LoginService } from './service/login.service';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, LoginComponent]
})
export class AppComponent {
  title = 'da-bubble';

  constructor(private loginService: LoginService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const actionCode = params['mode'];
      const oobCode = params['oobCode'];
      if (actionCode && oobCode) {
        this.loginService.handleActionCode(actionCode, oobCode);
      }
    });
  }

}
