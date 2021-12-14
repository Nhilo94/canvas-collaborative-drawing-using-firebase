import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root',
})
export class PFireService {
  constructor(
    private db: AngularFireDatabase,
    private storage: AngularFireStorage
  ) {}

  getItemCanvas(collection: string, userId: string) {
    return this.db
      .list<any>('/' + collection, (ref: any) =>
        ref.orderByChild('userId').equalTo(userId)
      )
      .snapshotChanges();
  }
  updateItemCanvas(collection: string, key: string, data: any) {
    return this.db.list<any>('/' + collection).update(key, data);
  }

  postItemCanvas(collection: string, data: any) {
    return this.db.list<any>('/' + collection).push(data);
  }
  uploadsImageFile(filePath: string, file: any) {
    const fileRef = this.storage.ref(filePath);
    return { task: this.storage.upload(filePath, file), fileRef };
  }
}
