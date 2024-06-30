import { Component } from '@angular/core';
import { DesktopResetPasswordComponent } from "../../desktop/desktop-reset-password/desktop-reset-password.component";
import { ResetPasswordCardComponent } from "../../shared/reset-password-card/reset-password-card.component";

@Component({
    selector: 'app-mobile-reset-password',
    standalone: true,
    templateUrl: './mobile-reset-password.component.html',
    styleUrl: './mobile-reset-password.component.scss',
    imports: [DesktopResetPasswordComponent, ResetPasswordCardComponent]
})
export class MobileResetPasswordComponent {

}
