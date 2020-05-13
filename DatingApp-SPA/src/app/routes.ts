import {Routes} from '@angular/router';
import {HomeComponent} from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberProfileComponent } from './members/member-profile/member-profile.component';
import { MemberEditProfileComponent } from './members/member-edit-profile/member-edit-profile.component';
import { MemberEditProfileResolver } from './_resolvers/member-edit-profile.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { MemberProfileResolver } from './_resolvers/member-profile.resolver';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessageResolver } from './_resolvers/message.resolver';

export const appRoutes: Routes = [

    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {path: 'members', component: MemberListComponent, resolve: {users: MemberListResolver}},
            {path: 'members/profile', component: MemberProfileComponent, resolve: {user: MemberProfileResolver}},
            {path: 'members/profile/edit', component: MemberEditProfileComponent,
             resolve: {user: MemberEditProfileResolver}, canDeactivate: [PreventUnsavedChanges]},
            {path: 'members/:id', component: MemberDetailsComponent, resolve: {user: MemberDetailResolver}},
            {path: 'messages', component: MessagesComponent, resolve: {messages: MessageResolver}},
            {path: 'lists', component: ListsComponent, resolve: {users: ListsResolver}},
        ]
    },
      {path: '**', redirectTo: '', pathMatch: 'full'},
];