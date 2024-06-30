import { Component } from '@angular/core';
import { AvatarCardComponent } from "../../shared/avatar-card/avatar-card.component";

@Component({
    selector: 'app-mobile-avatar',
    standalone: true,
    templateUrl: './mobile-avatar.component.html',
    styleUrl: './mobile-avatar.component.scss',
    imports: [AvatarCardComponent]
})
export class MobileAvatarComponent {

}
