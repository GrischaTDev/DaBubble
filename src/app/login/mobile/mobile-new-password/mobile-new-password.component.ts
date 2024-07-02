import { Component } from '@angular/core';
import { NewPasswordCardComponent } from "../../shared/new-password-card/new-password-card.component";

@Component({
    selector: 'app-mobile-new-password',
    standalone: true,
    templateUrl: './mobile-new-password.component.html',
    styleUrl: './mobile-new-password.component.scss',
    imports: [NewPasswordCardComponent]
})
export class MobileNewPasswordComponent {

}
