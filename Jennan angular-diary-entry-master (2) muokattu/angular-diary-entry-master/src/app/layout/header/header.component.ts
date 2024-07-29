import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  email = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    auth.getUser().subscribe((user) => {
      console.log('✔ logged user details:', user);
      this.email = user?.email;
    });
  }

  ngOnInit(): void {
  }

  async handleSignOut() {
    try {
      await this.auth.signOut();
      this.router.navigateByUrl('/signin');
      this.toastr.info('😃 Logout success!', '', {
        closeButton: true,
      });
      this.email = null;
    } catch (error) {
      console.error(error);
      this.toastr.error('😧 Error Signing out !!!', '', {
        closeButton: true,
      });
    }
  }

}
