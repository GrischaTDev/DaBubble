import { Component, OnInit } from '@angular/core';
import { MobileHeaderComponent } from "./header/mobile-header/mobile-header.component";
import { DesktopHeaderComponent } from "./header/desktop-header/desktop-header.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { DesktopChatComponent } from "./chat/desktop-chat/desktop-chat.component";
import { MobileChatComponent } from "./chat/mobile-chat/mobile-chat.component";
import { DesktopThreadComponent } from "./thread/desktop-thread/desktop-thread.component";
import { MobileThreadComponent } from "./thread/mobile-thread/mobile-thread.component";
import { DesktopChannelsComponent } from "./channels/desktop-channels/desktop-channels.component";
import { MobileChannelsComponent } from "./channels/mobile-channels/mobile-channels.component";
import { MainServiceService } from '../service/main-service.service';
import { AddChannelComponent } from './channels/add-channel/add-channel.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DirectChatComponent } from './chat/direct-chat/direct-chat.component';

@Component({
    selector: 'app-main',
    standalone: true,
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    imports: [
        MobileHeaderComponent,
        DesktopHeaderComponent,
        CommonModule,
        DesktopChatComponent,
        MobileChatComponent,
        DesktopThreadComponent,
        MobileThreadComponent,
        DesktopChannelsComponent,
        MobileChannelsComponent,
        AddChannelComponent,
        MatDialogModule,
        UserProfileComponent,
        DirectChatComponent
    ]
})
export class MainComponent implements OnInit {
  isDesktop: boolean = false;
  isThreadOpen: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver, private mainService: MainServiceService) {
      
  }

 ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      this.isDesktop = !result.matches; // Wenn es KEIN Handset oder Tablet ist, ist es Desktop
    });

    this.mainService.currentLoggedUser();
  }
}
