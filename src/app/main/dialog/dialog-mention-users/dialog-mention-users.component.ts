import { Component } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-mention-users',
  standalone: true,
  imports: [MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle, CommonModule],
  templateUrl: './dialog-mention-users.component.html',
  styleUrl: './dialog-mention-users.component.scss',
})
export class DialogMentionUsersComponent {
  loggedInUserId = '4m4EZCAqmNAl0EwzHTgG';
  users = [
    {
      firstName: 'Max',
      lastName: 'Mustermann',
      userId: '4m4EZCAqmNAl0EwzHTgG',
      photoPath: '/assets/img/user/user1.svg',
    },
    {
      firstName: 'Anna',
      lastName: 'Schmidt',
      userId: '5n5FZDBrnOBm1FxuIUhH',
      photoPath: '/assets/img/user/user2.svg',
    },
    {
      firstName: 'Lukas',
      lastName: 'Bauer',
      userId: '6o6GCEDsoPCn2GyvJViI',
      photoPath: '/assets/img/user/user3.svg',
    },
    {
      firstName: 'Sophia',
      lastName: 'Weber',
      userId: '7p7HDFEtpQDo3HzwKWjJ',
      photoPath: '/assets/img/user/user4.svg',
    },
    {
      firstName: 'Moritz',
      lastName: 'Becker',
      userId: '8q8IEGFuqREo4IzxLXkK',
      photoPath: '/assets/img/user/user5.svg',
    },
    {
      firstName: 'Julia',
      lastName: 'Koch',
      userId: '9r9JGHGvrSFp5JazMYlL',
      photoPath: '/assets/img/user/user6.svg',
    }
  ];
}
