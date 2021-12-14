import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { fabric } from 'fabric';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { debounce, filter, finalize, tap } from 'rxjs/operators';

import { PFireService } from 'src/app/p-core/services/p-fire.service';

@Component({
  selector: 'canvas-edit',
  templateUrl: './canvas-edit.component.html',
  styleUrls: ['./canvas-edit.component.scss'],
})
export class CanvasEditComponent implements OnInit, OnDestroy {
  @ViewChild('pCanvas') htmlCanvas: ElementRef<any>;

  private currentUser: any;
  private currentCanvas: any;
  private canvasCollectionName: string = 'canvassaved';

  private pathCreatedObs = new BehaviorSubject<{}>({});

  private canvas: fabric.Canvas;

  public size: any = {
    width: '750',
    height: '800',
  };

  color = '#000';

  json: any;
  hasCanvas: boolean;
  subscription: Subscription;
  uploadPercent: Observable<any>;
  downloadURL: Observable<string>;
  fileUpload: boolean;
  onDrawMode: boolean = true;

  uniqFlagReference: string[] = [];

  constructor(private pFireService: PFireService) {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    const userString = localStorage.getItem('user');
    this.currentUser = userString ? JSON.parse(userString) : null;

    this.subscription = this.pathCreatedObs
      .pipe(
        filter((item: any) => item.version),
        debounce(() => timer(1000))
      )
      .subscribe((json) => {
        this.saveCanvas(json);
      });
  }

  ngAfterViewInit(): void {
    if (this.currentUser) {
      this.pFireService
        .getItemCanvas(this.canvasCollectionName, this.currentUser.uid)
        .subscribe((res) => {
          console.log('Log ofofof');
          if (res.length) {
            this.currentCanvas = {
              idKey: res[0].payload.key,
              ...res[0].payload.val(),
            };
            this.hasCanvas = true;
            if (
              this.uniqFlagReference.length == 0 ||
              (this.uniqFlagReference.length &&
                !this.uniqFlagReference.includes(this.currentCanvas.uniqFlag))
            ) {
              this.loadCanvas(res[0].payload.val().canvas);
            }
          } else {
            this.loadCanvas();
          }
        });
    }
  }

  loadCanvas(init: any = null) {
    console.log('Hasw canvas');
    console.log(this.canvas);
    if (!this.canvas) {
      // setup front side canvas
      this.canvas = new fabric.Canvas('p-canvas', {
        hoverCursor: 'pointer',
        selection: false,
        selectionBorderColor: 'blue',
        isDrawingMode: true,
        stateful: true,
      });

      this.canvas.on('path:created', () => {
        this.pathCreatedObs.next(this.canvas.toJSON());
      });

      this.canvas.on('object:modified', () => {
        this.pathCreatedObs.next(this.canvas.toJSON());
      });

      this.canvas.setWidth(this.size.width);
      this.canvas.setHeight(this.size.height);
    }

    if (init) {
      this.canvas.loadFromJSON(init, this.canvas.renderAll.bind(this.canvas));
    }
  }

  saveCanvas(canvasJson: any) {
    const uniqFlag = `${Date.now()}_${this.currentUser.uid}`;
    this.uniqFlagRef(uniqFlag);

    if (this.hasCanvas) {
      this.pFireService
        .updateItemCanvas(this.canvasCollectionName, this.currentCanvas.idKey, {
          canvas: canvasJson,
          uniqFlag: uniqFlag,
        })
        .then((res) => this.saveResult(res));
    } else {
      this.pFireService
        .postItemCanvas(this.canvasCollectionName, {
          userId: this.currentUser.uid,
          canvas: canvasJson,
          uniqFlag: uniqFlag,
        })
        .then((res) => this.saveResult(res));
    }
  }

  uniqFlagRef(ref: string) {
    if (this.uniqFlagReference.length >= 100) {
      this.uniqFlagReference.shift();
    }
    this.uniqFlagReference.push(ref);
    console.log(this.uniqFlagReference);
  }

  saveResult(result: any) {
    console.log(result);
  }

  changeBrushColor(colorSelected: string) {
    this.color = colorSelected;
    this.canvas.freeDrawingBrush.color = colorSelected;
  }

  saveAndAddFile(event: any) {
    const file = event.target.files[0];
    const { task, fileRef } = this.pFireService.uploadsImageFile(
      `/${this.currentUser.uid}/${Date.now()}-${file.name}`,
      file
    );

    this.fileUpload = true;

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.toPromise().then((eltUrl) => {
            this.addImageOnCanvas(eltUrl);
          });
          this.fileUpload = false;
        })
      )
      .subscribe();
  }

  addImageOnCanvas(url: string) {
    if (url) {
      fabric.Image.fromURL(url, (image) => {
        image.set({
          left: 10,
          top: 10,
          angle: 0,
          padding: 10,
          cornerSize: 10,
          hasRotatingPoint: true,
        });

        image.scaleToWidth(200);
        image.scaleToHeight(200);

        this.canvas.isDrawingMode = false;
        this.onDrawMode = false;
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  selectItemAfterAdded(obj: any) {
    this.canvas.discardActiveObject().renderAll();
    this.canvas.setActiveObject(obj);
  }

  drawModeToogle() {
    console.log('Draw mode');
    console.log(this.canvas.isDrawingMode);
    this.onDrawMode = !this.onDrawMode;
    if (this.onDrawMode) {
      this.canvas.isDrawingMode = true;
      this.canvas.discardActiveObject().renderAll();
    } else {
      this.canvas.discardActiveObject().renderAll();
      this.canvas.isDrawingMode = false;
    }

    console.log('Final Draw mode');
    console.log(this.canvas.isDrawingMode);
  }
}
