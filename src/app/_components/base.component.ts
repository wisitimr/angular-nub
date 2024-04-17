import { FormGroup, } from '@angular/forms';

export class BaseComponent {

    protected isPassValidation(formGroup: FormGroup): boolean {
        let result = true;
        for (const key of Object.keys(formGroup.controls)) {
            if (formGroup.controls[key].invalid) {
                // console.log('key: ', key);
                // console.log("formGroup.controls[key]: ", formGroup.controls[key]);
                result = false;
                break;
            }
        }
        return result;
    }

    protected showRequiredField(formGroup: FormGroup) {
        for (const key of Object.keys(formGroup.controls)) {
            if (formGroup.controls[key].invalid) {
                formGroup.controls[key].markAsDirty();
            }
        }
    }

    protected timeout(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    protected formatPrice(v) {
        if (v) {
            return Number(parseFloat(v)).toLocaleString('en', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
            });
        } else if (v == 0) {
            return '0.00';
        } else {
            return undefined;
        }
    }

    protected unformatPrice(v) {
        if (v) {
            if (typeof v === 'string') {
                return Number(v.replace(/,/g, ''));
            } else {
                return v;
            }
        } else if (v === 0) {
            return 0;
        } else {
            return undefined;
        }
    }
}
