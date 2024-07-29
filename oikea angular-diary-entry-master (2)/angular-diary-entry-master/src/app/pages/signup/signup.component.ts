import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

// firebase
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

// image resizer
import { readAndCompressImage } from 'browser-image-resizer';
import { imageConfig } from 'src/utils/config';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  picture: string = 'https://image.freepik.com/free-vector/smiling-face-emoji_1319-431.jpg';
  uploadPercent: number = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm) {
    const { email, password, username, country, bio, name } = f.form.value;

    this.auth.signUp(email, password)
      .then((res) => {
        console.info('signup', res);
        const { uid } = res.user;

        this.db.object(`/users/${uid}`).set({
          id: uid,
          name: name,
          username: username,
          country: country,
          bio: bio,
          picture: this.picture
        })
      })
      .then(() => {
        this.router.navigateByUrl('/home');
        this.toastr.info('😃 SignUp success!');
      })
      .catch((err) => {
        console.error(err);
        this.toastr.error('😧 Error Signing up !!!');
      })
  }

  async uploadFile(event) {
    const file = event.target.files[0];
    let resizedImage = await readAndCompressImage(file, imageConfig);
    const filePath = uuidv4();
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, resizedImage);
    task.percentageChanges().subscribe((percent) => {
      this.uploadPercent = percent;
    })

    task.snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.picture = url;
            this.toastr.success('📷 Image upload success!');
          })
        })
      ).subscribe();
  }

}
