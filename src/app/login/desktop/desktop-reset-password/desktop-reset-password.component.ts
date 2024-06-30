import { Component } from '@angular/core';
import { ResetPasswordCardComponent } from "../../shared/reset-password-card/reset-password-card.component";

@Component({
    selector: 'app-desktop-reset-password',
    standalone: true,
    templateUrl: './desktop-reset-password.component.html',
    styleUrl: './desktop-reset-password.component.scss',
    imports: [ResetPasswordCardComponent]
})
export class DesktopResetPasswordComponent {

}
