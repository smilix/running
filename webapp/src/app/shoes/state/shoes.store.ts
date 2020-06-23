import {Injectable} from '@angular/core';
import {EntityState, EntityStore, StoreConfig} from '@datorama/akita';
import {Shoe} from './shoe.model';

export interface ShoesState extends EntityState<Shoe> {
}

@Injectable({providedIn: 'root'})
@StoreConfig({
  name: 'shoes',
  cache: {
    ttl: 3600000
  }
})
export class ShoesStore extends EntityStore<ShoesState> {

  constructor() {
    super();
  }

}
