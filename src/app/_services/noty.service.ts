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
            timer: 1500,
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

    async confirm() {
        const result = await Swal.fire({
            title: "Delete?",
            showDenyButton: true,
            confirmButtonText: "Confirm",
            denyButtonText: "Cancel",
            icon: "question"
        })
        if (result.isConfirmed) {
            return true;
        } else if (result.isDenied) {
            return false;
        }
    }
}
