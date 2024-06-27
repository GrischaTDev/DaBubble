import { Component, OnInit } from '@angular/core';
import { ChannelListComponent } from "./channel-list/channel-list.component";
import { MobileHeaderComponent } from "./header/mobile-header/mobile-header.component";
import { DesktopHeaderComponent } from "./header/desktop-header/desktop-header.component";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  imports: [
    ChannelListComponent, 
    MobileHeaderComponent, 
    DesktopHeaderComponent,
    CommonModule
  ]
})
export class MainComponent implements OnInit {
  isDesktop: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver.observe([
      Breakpoints.Handset,
      Breakpoints.Tablet
    ]).subscribe(result => {
      this.isDesktop = !result.matches; // Wenn es KEIN Handset oder Tablet ist, ist es Desktop
    });
  }
}
