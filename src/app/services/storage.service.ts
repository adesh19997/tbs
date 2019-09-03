import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
@Injectable()
export class StorageService {
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  uploadProgress: any;
  constructor(private afStorage: AngularFireStorage) { }

  uploadFile(file, image) {
    this.ref = this.afStorage.ref('/Test/' + image.uid);
    this.task = this.ref.put(file);
    this.task.snapshotChanges().subscribe( data =>{
      image.state = data.state;
    })
    this.task.downloadURL().subscribe(data => {
      image.downloadURL = data;
      image.state = "uploaded";
    });
  }



}
