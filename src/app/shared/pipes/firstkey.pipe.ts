import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstKey',
  standalone: true
})
export class FirstKeyPipe implements PipeTransform {
  transform(value: any): string {
    if (!value) {
      return '';
    }
    return Object.keys(value)[0];
  }
}