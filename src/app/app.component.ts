import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  DocumentChangeAction,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

/** 扱うデータの型 */
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
  private itemsCollection: AngularFirestoreCollection<Item>;
  /** コレクションのObservable */
  items: Observable<Item[]>;
  /** コレクションsnapshotのObservable */
  tiemsSnapshot: Observable<DocumentChangeAction<Item>[]>;

  /** フォームコントロール（追加用） */
  name = new FormControl('');
  age = new FormControl('');

  /** フォームコントロール（更新用） */
  updatedName = new FormControl('');
  updatedAge = new FormControl('');

  /** 更新するドキュメントID */
  updatedId: string;

  /** ボタンがdisableかどうか */
  isDisabledDelete = false;
  isDisabledEdit = true;

  /** AngularFirestoreをDI */
  constructor(private afs: AngularFirestore) {
    /** itemsコレクションを取得してitemsCollectionに代入 */
    this.itemsCollection = afs.collection<Item>('items');
  }

  ngOnInit(): void {
    /** Read: データを参照（ストリームに変換） */
    this.items = this.itemsCollection.valueChanges();
    this.tiemsSnapshot = this.itemsCollection.snapshotChanges();

    /** サブスクライブ */
    this.items.subscribe(a => {
      console.log(a);
    });
    this.tiemsSnapshot.subscribe(a => {
      console.log(a);
    });
  }

  /** Create: データを追加 */
  addItem(): void {
    const id = this.afs.createId();
    const item: Item = {
      id,
      name: this.name.value,
      age: this.age.value,
    };
    this.itemsCollection.doc(id).set(item);
    this.name.setValue('');
    this.age.setValue('');
  }

  /** 編集用のフォームにデータを表示 */
  editItem(item: Item): void {
    this.updatedName.setValue(item.name);
    this.updatedAge.setValue(item.age);
    this.updatedId = item.id;
    this.isDisabledDelete = true;
    this.isDisabledEdit = false;
  }

  /** Update: データを更新 */
  updateItem(): void {
    const item = {
      id: this.updatedId,
      name: this.updatedName.value,
      age: this.updatedAge.value,
    };
    this.itemsCollection.doc(this.updatedId).update(item);
    this.updatedName.setValue('');
    this.updatedAge.setValue('');
    this.updatedId = null;
    this.isDisabledDelete = false;
    this.isDisabledEdit = true;
  }

  /** データを削除 */
  deleteItem(item: Item): void {
    this.itemsCollection.doc(item.id).delete();
  }
}
