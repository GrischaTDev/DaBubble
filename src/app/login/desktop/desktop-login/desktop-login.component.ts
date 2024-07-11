import { Component, OnInit } from '@angular/core';
import { LoginCardComponent } from './../../shared/login-card/login-card.component';
import { RouterModule } from '@angular/router';
import { animate, query, sequence, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'app-desktop-login',
  standalone: true,
  imports: [
    LoginCardComponent,
    RouterModule
  ],
  animations: [
    trigger('desktopStartAnimation', [
      transition('hidden => visible', [
        sequence([
          query('h1', [
            style({ display: 'none', transform: 'translateX(-100%)'}),
            animate('1.5s cubic-bezier(0.64, -0.84, 0.28, 1.3)', style({ display: 'block', transform: 'translateX(0)'}))
          ], { optional: true })
        ])
      ]),
      transition('visible => hidden', [
        style({ opacity: 1, display: 'flex' }),
        animate('1.5s cubic-bezier(0.64, -0.84, 0.28, 1.3)', style({ opacity: 0 }))
      ])
    ])
  ],
  templateUrl: './desktop-login.component.html',
  styleUrl: './desktop-login.component.scss'
})
export class DesktopLoginComponent implements OnInit {

  isVisible = 'hidden';

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = 'visible';
    }, 0);
  }

  toggleToHidden(event: any): void {
    if(this.isVisible === 'visible') {
      this.isVisible = 'hidden';
    }
  }

}
