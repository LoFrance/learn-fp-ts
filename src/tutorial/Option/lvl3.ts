import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

const doubleValue = (opt: O.Option<number>): O.Option<number> => {
  return O.map((n: number) => n * 2)(opt);
};

/*
toNullable: converte un Option in un valore null
toUndefined: converte un Option in un valore undefined
*/

const pipeable = (n: number | null): number | undefined =>
  pipe(n, O.fromNullable, doubleValue, doubleValue, O.toUndefined);
/*
toUndefined vs toNullable:
toUndefined: converte un Option in un valore undefined
toNullable: converte un Option in un valore null
È meglio usare toUndefined perché è più leggibile e non crea confusione con il valore null
*/

console.log("Passando un valore valido:", pipeable(2)); // Output: 8
console.log("Passando un valore null:", pipeable(null)); // Output: null
