import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-manage',
  templateUrl: './admin-manage.component.html',
  styleUrls: ['./admin-manage.component.scss']
})
export class AdminManageComponent {
  constructor(private router: Router){

  }
  cardList: any[] = [
    // {
    //   title: 'Form Management',
    //   // description:
    //   //   'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
    //   type: 'dashboard',
    // },

    {
      title: 'Claim Management',
      // description:
      //   'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
      type: 'users',
    },
  ];

  navigateto(item: any) {
    console.log(item);
    switch (item.type) {
      case 'dashboard':
        // this.router.navigate(['/super-admin/dashboard']);
        break;
      case 'users':
        this.router.navigate(['/admin/manage-claim']);
        break;

      default:
        return '';
    }
    return;

    // this.router.navigate(['/user-manage'])
  }

}
