import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  template: `
    <ul>
      <li *ngFor="let item of (items | async)">
        name: {{ item.name }} / age: {{ item.age }}
      </li>
    </ul>
  `,
})
export class AppComponent {
  items: Observable<any[]>;

  constructor(db: AngularFirestore) {
    this.items = db.collection('items').valueChanges();
  }
}
