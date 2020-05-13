import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { UserService } from 'src/app/_services/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-profile',
  templateUrl: './member-profile.component.html',
  styleUrls: ['./member-profile.component.css']
})
export class MemberProfileComponent implements OnInit {
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  
  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.loadUser();
    this.galleryOptions = [
      {
          width: '500px',
          height: '500px',
          imagePercent: 100,
          thumbnailsColumns: 4,
          imageAnimation: NgxGalleryAnimation.Slide,
          preview: false
      },
    ];
    this.galleryImages = this.getImages();
  }
  loadUser() {
    this.route.data.subscribe(data => {
    this.user = data['user'];
    
  });
  }

  getImages() {
    const photosURL = [];
    for (const photo of this.user.photos) {
      photosURL.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        descrption: photo.description
      });
    }
    return photosURL;
  }
}

