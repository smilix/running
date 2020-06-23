export interface Shoe {
  id: number;
  bought: number;
  comment: string;
  used: number;
  totalLength: number;
}

export function createShoe(params: Partial<Shoe>) {
  return {

  } as Shoe;
}

