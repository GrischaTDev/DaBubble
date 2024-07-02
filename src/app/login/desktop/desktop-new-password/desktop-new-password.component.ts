import { Component } from '@angular/core';
import { NewPasswordCardComponent } from "../../shared/new-password-card/new-password-card.component";

@Component({
    selector: 'app-desktop-new-password',
    standalone: true,
    templateUrl: './desktop-new-password.component.html',
    styleUrl: './desktop-new-password.component.scss',
    imports: [NewPasswordCardComponent]
})
export class DesktopNewPasswordComponent {

}
