import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

interface Item {
  id: string;
  name: string;
  age: number;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  // items: Observable<any[]>;
  itemCollection: AngularFirestoreCollection<Item>;
  itemDoc: AngularFirestoreDocument<Item>;
  items: Observable<Item[]>;
  item: Observable<Item>;

  name = new FormControl('');
  age = new FormControl('');
  updatedName = new FormControl('');
  updatedAge = new FormControl('');
  updatedId: string;

  isDisabledDelete = false;
  isDisabledEdit = true;

  constructor(private afs: AngularFirestore) {
    this.itemCollection = afs.collection<Item>('items');
    this.itemDoc = afs.doc<Item>('name/mary');
  }

  ngOnInit(): void {
    this.items = this.itemCollection.valueChanges();
    this.item = this.itemDoc.valueChanges();
    this.items.subscribe(a => {
      console.log(a);
    });
    this.item.subscribe(a => {
      console.log(a);
    });
  }

  addItem(): void {
    const id = this.afs.createId();
    const item: Item = {
      id,
      name: this.name.value,
      age: this.age.value,
    };
    this.itemCollection.doc(id).set(item);
    this.name.setValue('');
    this.age.setValue('');
  }

  editItem(item: Item): void {
    this.updatedName.setValue(item.name);
    this.updatedAge.setValue(item.age);
    this.updatedId = item.id;
    this.isDisabledDelete = true;
    this.isDisabledEdit = false;
  }

  updateItem(): void {
    const item = {
      id: this.updatedId,
      name: this.updatedName.value,
      age: this.updatedAge.value,
    };
    this.itemCollection.doc(this.updatedId).update(item);
    this.updatedName.setValue('');
    this.updatedAge.setValue('');
    this.updatedId = null;
    this.isDisabledDelete = false;
    this.isDisabledEdit = true;
  }

  deleteItem(item: Item): void {
    this.itemCollection.doc(item.id).delete();
  }
}
