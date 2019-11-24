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
    image.state = "running";
    this.task.snapshotChanges().subscribe( data =>{
      image.state = data.state;
    })
    this.task.downloadURL().subscribe(data => {
      image.downloadURL = data;
      image.state = "uploaded";
      image.bFileAdded = true;
    });
  }

  downloadFile(filename): void {
    this.afStorage.ref('/Test/').child(filename)
      .getDownloadURL().then((url) => {
          const xhr = new XMLHttpRequest();
          xhr.responseType = 'blob';
          xhr.onload = (event) => {
            /* Create a new Blob object using the response
            *  data of the onload object.
            */
            const blob = new Blob([xhr.response], { type: 'image/jpg' });
            const a: any = document.createElement('a');
            a.style = 'display: none';
            document.body.appendChild(a);
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
          };
          xhr.open('GET', url);
          xhr.send();
        }).catch(function(error) {
          // Handle any errors
          console.log(error);
        });
      }

}
