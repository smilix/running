import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {cacheable, ID} from '@datorama/akita';
import {map, tap} from 'rxjs/operators';
import {Shoe} from './shoe.model';
import {ShoesStore} from './shoes.store';
import {environment} from "../../../environments/environment";
import {ErrorDialogService} from "../../shared/error-dialog/error-dialog.component";
import {Run} from "../../runs/state/run.model";
import {Observable} from "rxjs";
import {ApiResponse} from "../../shared/api";

interface ShoesResponse extends ApiResponse {
  count: number;
  shoes: Shoe[];
}


interface ShoeAddResponse extends ApiResponse {
  id: number;
}

@Injectable({providedIn: 'root'})
export class ShoesService {

  constructor(
    private http: HttpClient,
    private shoesStore: ShoesStore,
    private errorDialog: ErrorDialogService
  ) {
  }

  load() {
    return cacheable(this.shoesStore,
      this.http.get<ShoesResponse>(environment.backendPath + '/shoes').pipe(
        tap(entities => {
          this.shoesStore.set(entities.shoes);
        }),
        this.errorDialog.catchApiError('Loading shoes'),
      )).subscribe();
  }

  add(newShoe: Pick<Shoe, 'bought' | 'comment'>): Observable<Shoe> {
    return this.http.post<ShoeAddResponse>(environment.backendPath + '/shoes', newShoe).pipe(
      map(result => {
        const shoe: Shoe = {
          ...newShoe,
          id: result.id,
          totalLength: 0,
          used: 0
        };
        this.shoesStore.add(shoe);
        return shoe;
      }),
      this.errorDialog.catchApiError('Adding shoe'));
  }

  update(id, shoe: Partial<Shoe>): Observable<Partial<Shoe>> {
    return this.http.put<Partial<Shoe>>(`${environment.backendPath}/shoes/${id}`, shoe).pipe(
      map(updatedShoe => {
        const combinedShoe = {
          ...shoe,
          updatedShoe
        };

        this.shoesStore.update(id, combinedShoe);
        return combinedShoe;
      }),
      this.errorDialog.catchApiError('Updating shoe'));
  }

  remove(id: ID): Observable<any> {
    return this.http.delete(`${environment.backendPath}/shoes/${id}`).pipe(
      tap(() => {
        this.shoesStore.remove(id);
      }),
      this.errorDialog.catchApiError('Deleting shoe'));
  }

}
