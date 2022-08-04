import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-video-record',
  templateUrl: './video-record.component.html',
  styleUrls: ['./video-record.component.css'],
})
export class VideoRecordComponent implements OnInit {
  @ViewChild('video', { static: true }) //variable from html
  public video: ElementRef;

  @ViewChild('canvas', { static: true }) //variable from html
  public canvas: ElementRef;

  public captures: Array<any>;
  private imageSrc: string = '';

  public constructor(private apiService: ApiService) {
    this.captures = [];
  }

  public ngOnInit() {}

  public ngAfterViewInit() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          setInterval(() => {
            console.log('works');
            if (this.captures.length < 10) {
              this.sendPhoto(this.capture());
            }
          }, 2000);
        })
        .catch((err) => alert(`Bummer! ${err.name}.`));
    }
  }
  capture() {
    const context = this.canvas.nativeElement
      .getContext('2d')
      .drawImage(this.video.nativeElement, 0, 0, 640, 480);
    this.captures.push(this.canvas.nativeElement.toDataURL('image/png'));
    console.log('picture taken', this.captures[0]);
    console.log('array.length: ', this.captures.length);
    return this.canvas.nativeElement.toDataURL('image/png');
  }

  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc = reader.result;
    console.log(this.imageSrc);
  }
  sendPhoto(image) {
    console.log('the image i want to send', image);
    this.apiService.sendImage(image).subscribe((res) => {
      console.log(res);

      alert('Uploaded Successfully.');
    });
  }
}
