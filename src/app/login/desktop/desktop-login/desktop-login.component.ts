import { Component, OnInit } from '@angular/core';
import { LoginCardComponent } from './../../shared/login-card/login-card.component';
import { RouterModule } from '@angular/router';
import { animate, query, sequence, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-desktop-login',
  standalone: true,
  imports: [
    LoginCardComponent,
    RouterModule,
    CommonModule
  ],
  animations: [
    trigger('desktopStartAnimation', [
      transition('hidden => visible', [
        sequence([
          query('h1', [
            style({ display: 'none', transform: 'translateX(-100%)' }),
            animate('1.5s cubic-bezier(0.64, -0.84, 0.28, 1.3)', style({ display: 'block', transform: 'translateX(0)' }))
          ], { optional: true })
        ])
      ]),
      transition('visible => hidden', [
        style({ opacity: 1 }),
        animate('1.5s cubic-bezier(0.64, -0.84, 0.28, 1.3)', style({ opacity: 0 }))
      ]),
    ]),
    trigger('desktopSectionAnimation', [
      transition('hidden => visible', [
        style({ opacity: 0 }),
        animate('2s cubic-bezier(0.64, -0.84, 0.28, 1.3)', style({ opacity: 1 }))
      ])
    ]),
    trigger('movingLogo', [
      transition('center => final', [
        style({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 }), 
        animate('1s ease-out', style({ top: '75px', left: '75px', transform: 'translate(0, 0)', opacity: 1 }))
      ])
    ])
  ],
  templateUrl: './desktop-login.component.html',
  styleUrl: './desktop-login.component.scss'
})
export class DesktopLoginComponent implements OnInit {

  isVisible = 'hidden';
  isSectionVisible = 'hidden';
  showSection: boolean = false;
  hideAnimationContainer: boolean = true;
  isLogoMoving = 'center';

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = 'visible';
    }, 1000);
  }

  toggleToHidden(event: any): void {
    if (this.isVisible === 'visible') {
      this.isVisible = 'hidden';
      this.hideAnimationContainer = false;
      setTimeout(() => {
        this.showSection = true;
        this.isSectionVisible = 'visible';
      }, 0); 
      setTimeout(() => {
         this.isLogoMoving = 'final'; 
      }, 0);
    }
  }

}
