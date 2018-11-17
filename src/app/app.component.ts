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
  /** コレクション */
  itemCollection: AngularFirestoreCollection<Item>;
  /** ドキュメント */
  itemDoc: AngularFirestoreDocument<Item>;
  /** コレクションのObservable */
  items: Observable<Item[]>;

  name = new FormControl('');
  age = new FormControl('');
  updatedName = new FormControl('');
  updatedAge = new FormControl('');
  updatedId: string;
  isDisabledDelete = false;
  isDisabledEdit = true;

  constructor(private afs: AngularFirestore) {
    this.itemCollection = afs.collection<Item>('items');
  }

  ngOnInit(): void {
    /** Read: アイテムを取得 */
    this.items = this.itemCollection.valueChanges();
    this.items.subscribe(a => {
      console.log(a);
    });
  }

  /** Create: アイテムを追加 */
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

  /** Update: アイテムを更新 */
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

  /** アイテムを削除 */
  deleteItem(item: Item): void {
    this.itemCollection.doc(item.id).delete();
  }
}
