import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class NotyService {

    constructor() { }

    success(title: any = null, text: any = null, footer: any = null) {
        Swal.fire({
            icon: "success",
            title,
            text,
            footer
        });
    }

    error(title: any = null, text: any = null, footer: any = null) {
        Swal.fire({
            icon: "error",
            title,
            text,
            footer
        });
    }

    info(title: any = null, text: any = null, footer: any = null) {
        Swal.fire({
            icon: "info",
            title,
            text,
            footer
        });
    }

    warning(title: any = null, text: any = null, footer: any = null) {
        Swal.fire({
            icon: "warning",
            title,
            text,
            footer
        });
    }

    // async confirm(option: any = {}) {
    //     const result = await swal({
    //         ...{
    //             title: 'ยืนยันการทำรายการ',
    //             type: 'warning',
    //             showCancelButton: true,
    //             confirmButtonText: 'ตกลง',
    //             cancelButtonText: 'ยกเลิก'
    //         }, ...option
    //     });
    //     if (result && result.value) {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
}
