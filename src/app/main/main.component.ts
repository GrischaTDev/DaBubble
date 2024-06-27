import { Component } from '@angular/core';
import { ChannelListComponent } from "./channel-list/channel-list.component";

@Component({
    selector: 'app-main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    imports: [ChannelListComponent]
})
export class MainComponent {

}
