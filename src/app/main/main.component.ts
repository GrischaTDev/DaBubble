import { Component, OnInit } from '@angular/core';
import { MobileHeaderComponent } from "./header/mobile-header/mobile-header.component";
import { DesktopHeaderComponent } from "./header/desktop-header/desktop-header.component";
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
import { MobileChatHeaderComponent } from './header/mobile-chat-header/mobile-chat-header.component';
import { MatIconModule } from '@angular/material/icon';
import { DesktopDirectChatComponent } from './chat/desktop-direct-chat/desktop-direct-chat.component';

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
        DirectChatComponent,
        MobileChatHeaderComponent,
        MatIconModule,
        DesktopDirectChatComponent
    ]
})
export class MainComponent  implements OnInit {
  isThreadOpen: boolean = false;
  isWorkspaceOpen: boolean = true;
  closeMenu: string = 'arrow_drop_up';
  closeMenuText: string = 'Workspace-Menü schließen';
  currentChannel: any = [];
  directChatOpen: boolean = false;

  constructor(public mainService: MainServiceService) {}

  ngOnInit(): void {

  }

  closeOpenWorkspace() {
    this.isWorkspaceOpen = !this.isWorkspaceOpen;
    this.closeMenu = this.isWorkspaceOpen ? 'arrow_drop_up' : 'arrow_drop_down';
    this.closeMenuText = this.isWorkspaceOpen ? 'Workspace-Menü schließen' : 'Workspace-Menü öffnen';
  }
}
