import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { VideoRecordingService } from '../../services/video-recording.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-video-record',
  templateUrl: './video-record.component.html',
  styleUrls: ['./video-record.component.css'],
})
export class VideoRecordComponent implements OnDestroy {
  @ViewChild('videoElement') videoElement: any;

  video: any;
  isPlaying = false;
  displayControls = true;
  isVideoRecording = false;
  videoRecordedTime;
  videoBlobUrl;
  audioBlob;
  videoBlob;
  audioName;
  videoName;
  videoStream: MediaStream;
  videoConf = { video: { facingMode: 'user', width: 320 }, audio: true };

  constructor(
    private ref: ChangeDetectorRef,
    private videoRecordingService: VideoRecordingService,
    private sanitizer: DomSanitizer
  ) {
    this.videoRecordingService.recordingFailed().subscribe(() => {
      this.isVideoRecording = false;
      this.ref.detectChanges();
    });

    this.videoRecordingService.getRecordedTime().subscribe((time) => {
      this.videoRecordedTime = time;
      this.ref.detectChanges();
    });

    this.videoRecordingService.getStream().subscribe((stream) => {
      this.videoStream = stream;
      this.ref.detectChanges();
    });

    this.videoRecordingService.getRecordedBlob().subscribe((data) => {
      this.videoBlob = data.blob;
      this.videoName = data.title;
      this.videoBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data.url);
      this.ref.detectChanges();
    });
  }

  ngOnInit() {}
  public ngAfterViewInit(): void {
    if (this.videoElement !== undefined) {
      this.video = this.videoElement.nativeElement;
    }
  }
  startVideoRecording() {
    if (!this.isVideoRecording) {
      this.video.controls = false;
      this.isVideoRecording = true;
      this.videoRecordingService
        .startRecording(this.videoConf)
        .then((stream) => {
          // this.video.src = window.URL.createObjectURL(stream);
          this.video.srcObject = stream;
          this.video.play();
        })
        .catch(function (err) {
          console.log(err.name + ': ' + err.message);
        });
    }
  }

  abortVideoRecording() {
    if (this.isVideoRecording) {
      this.isVideoRecording = false;
      this.videoRecordingService.abortRecording();
      this.video.controls = false;
    }
  }

  stopVideoRecording() {
    if (this.isVideoRecording) {
      this.videoRecordingService.stopRecording();
      this.video.srcObject = this.videoBlobUrl;
      this.isVideoRecording = false;
      this.video.controls = true;
    }
  }

  clearVideoRecordedData() {
    this.videoBlobUrl = null;
    this.video.srcObject = null;
    this.video.controls = false;
    this.ref.detectChanges();
  }

  downloadVideoRecordedData() {
    this._downloadFile(this.videoBlob, 'video/mp4', this.videoName);
  }

  ngOnDestroy(): void {}

  _downloadFile(data: any, type: string, filename: string): any {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    //this.video.srcObject = stream;
    //const url = data;
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = url;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}
