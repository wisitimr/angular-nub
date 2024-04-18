import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';

declare global {
  interface Navigator {
    msSaveBlob?: (blob: any, defaultName?: string) => boolean;
  }
}

@Injectable()
export class FileService {
  errors: Array<string> = [];
  private maxSize: number = 30;
  private maxSize10MB: number = 10;
  private maxSize5MB: number = 5;
  private;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  isValidFileExtension(files: any, fileExt: string) {
    // Make array of file extensions
    var extensions = fileExt.split(',').map(function (x) {
      return x.toLocaleUpperCase().trim();
    });

    let result: boolean = false;
    for (var i = 0; i < files.length; i++) {
      // Get file extension
      var ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
      // Check the extension exists
      var exists = extensions.indexOf(ext) > -1;
      if (!exists) {
        this.errors.push('ประเภทไฟล์ไม่ถูกต้อง');
        result = false;
        break;
      } else {
        // Check file size
        // result = this.isValidFileSize5MB(files);
        result = this.isValidFileSize10MB(files);
      }
    }
    // console.log("result: ", result);
    return result;
  }

  isValidFileSize(file: any) {
    var fileSizeiMB = file.size / (1024 * 1000);
    var size = Math.round(fileSizeiMB * 100) / 100; // convert upto 2 decimal place
    if (size > this.maxSize) {
      this.errors.push('ขนาดไฟล์เกิน 30 MB');
      return false;
    } else {
      return true;
    }
  }

  isValidFileSize10MB(file: any) {
    var fileSizeiMB: number = file[0].size / 1024 / 1024;
    if (fileSizeiMB > this.maxSize10MB) {
      // this.errors.push("Error (File Size): " + file.name + ": ขนาดไฟล์เกินกำหนด " + this.maxSize + "MB ( ขนาดไฟล์จริง " + fileSizeiMB + "MB )");
      this.errors.push('ขนาดไฟล์เกิน 10 MB');
      return false;
    } else {
      return true;
    }
  }

  isValidFileSize5MB(file: any) {
    var fileSizeiMB: number = file[0].size / 1024 / 1024;
    if (fileSizeiMB > this.maxSize5MB) {
      // this.errors.push("Error (File Size): " + file.name + ": ขนาดไฟล์เกินกำหนด " + this.maxSize + "MB ( ขนาดไฟล์จริง " + fileSizeiMB + "MB )");
      this.errors.push('ขนาดไฟล์เกิน 5 MB');
      return false;
    } else {
      return true;
    }
  }

  downloadFile(response, fileName) {
    if (response) {
      let file = new Blob([response], { type: 'application/octet-stream' });
      // if (this.detectIE()) {
      //     window.navigator.msSaveBlob(file, fileName);
      // } else {
      let fileURL = URL.createObjectURL(file);
      let a = document.createElement('a');
      document.body.appendChild(a);
      // a.style = "display:none";

      a.href = fileURL;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(fileURL);
      a.remove();
      // }
    }
  }

  previewImage(response: File, FileName: string) {
    const w: any = window.open(''),
      reader = new FileReader();
    reader.readAsDataURL(response);
    reader.onload = (_event) => {
      w.document.write(`<img src="${reader.result}" width="100%"/>`);
      w.document.title = FileName;
    };
  }

  detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      console.log(
        'IE version: ',
        parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10)
      );
      return true;
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      console.log(
        'IE version: ',
        parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10)
      );
      return true;
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      console.log(
        'IE version: ',
        parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10)
      );
      return true;
    }

    // other browser
    return false;
  }
}
