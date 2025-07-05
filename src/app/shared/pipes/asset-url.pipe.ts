import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'assetUrl',
})
export class AssetUrlPipe implements PipeTransform {
  transform(path: string): string {
    return `${environment.assetsBaseUrl}/${path}`;
  }
}
