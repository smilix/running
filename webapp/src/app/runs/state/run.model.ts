import {Shoe} from "../../shoes/state/shoe.model";

export interface Run {
  id: number;
  length: number;
  date: number;
  // in seconds
  timeUsed: number;
  comment: string;
  shoeId: number;
}

export interface RunWithShoe extends Run {
  shoe: Shoe
}

export function createRun(params: Partial<Run>) {
  return {} as Run;
}
