import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-direct-chat',
  standalone: true,
  imports: [],
  templateUrl: './direct-chat.component.html',
  styleUrl: './direct-chat.component.scss'
})
export class DirectChatComponent {
  constructor(private route: ActivatedRoute) { }
  user: string = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      const userId = params['userId'];
      this.user = userId;
      console.log('User Chat', this.user);
      
      // Lade Chat-Daten für userId
    });
  }
}
