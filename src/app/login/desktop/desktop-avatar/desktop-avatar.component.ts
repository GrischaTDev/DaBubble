import { Component } from '@angular/core';
import { AvatarCardComponent } from "../../shared/avatar-card/avatar-card.component";

@Component({
    selector: 'app-desktop-avatar',
    standalone: true,
    templateUrl: './desktop-avatar.component.html',
    styleUrl: './desktop-avatar.component.scss',
    imports: [AvatarCardComponent]
})
export class DesktopAvatarComponent {

}
