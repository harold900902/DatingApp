import { Injectable } from '@angular/core';
import { CanActivate, Router, CanDeactivate } from '@angular/router';
import { MemberEditProfileResolver } from '../_resolvers/member-edit-profile.resolver';
import { MemberEditProfileComponent } from '../members/member-list/member-edit-profile/member-edit-profile.component';
//import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<MemberEditProfileComponent> {
    //bsModalRef: BsModalRef;
  //  constructor(private modalService: BsModalService) {}
    canDeactivate(component: MemberEditProfileComponent) {
     if (component.editForm.dirty) {
        //     const initialState = {
        //         list: [
        //           'Are you sure you want to continue? Any unsaved changes will'
        //         ],
        //         title: 'Modal with component'
        //       };
        //     this.bsModalRef = this.modalService.show(MemberEditProfileComponent, {initialState});
        //     this.bsModalRef.content.closeBtnName = 'Close';
           return confirm('Are you sure you want to continue? Any unsaved changes will');
        }
        return true;
    }
}
