import { Component, OnInit, ViewChild, AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { TabsetComponent } from 'ngx-bootstrap/tabs/ngx-bootstrap-tabs';
import { AuthService } from 'src/app/_services/auth.service';



@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css'],
 
})
export class MemberDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userService: UserService, private alertify: AlertifyService,
              private route: ActivatedRoute, private cdRef: ChangeDetectorRef,
              private authService: AuthService) { }

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
  ngAfterViewInit(){
    this.route.queryParams.subscribe(params => {
      const selectTabId = params['tab'];
      selectTabId > 0 ? this.selectTab(selectTabId) : this.selectTab(0);
    });
    this.cdRef.detectChanges();
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
  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
  }
  sendLike() {
    var userId = this.authService.decodeToken.nameid;
    this.userService.sendLike(userId, this.user.id).subscribe(data => {
      this.alertify.success('You have liked: ' + this.user.knownAs);
    }, error => {
      this.alertify.error(error);
    });

  }
}
