import { Cidade } from "./cidade";

export interface Estado {
  id: number;
  name: string;
  cities: Array<Cidade>;
}
