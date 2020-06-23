import {Injectable} from '@angular/core';
import {Order, QueryEntity} from '@datorama/akita';
import {ShoesStore, ShoesState} from './shoes.store';
import {Shoe} from "./shoe.model";
import {Observable} from "rxjs";
import {filter, take} from "rxjs/operators";
import {Run} from "../../runs/state/run.model";

@Injectable({providedIn: 'root'})
export class ShoesQuery extends QueryEntity<ShoesState> {

  // completes when the store is loaded
  readonly whenLoaded$: Observable<any> = this.selectLoading().pipe(
    filter(l => !l),
    take(1));

  readonly allShoesSorted$: Observable<Shoe[]> = this.selectAll({
    sortBy: 'bought',
    sortByOrder: Order.DESC,
  });

  constructor(protected store: ShoesStore) {
    super(store);
  }


  latestShoe(): Shoe | null {
    const shoes = this.getAll();
    if (!shoes || shoes.length == 0) {
      return null;
    }

    return shoes.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    }, shoes[0]);
  }
}
