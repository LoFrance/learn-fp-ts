import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/lib/function";

const doubleValue = (opt: O.Option<number>): O.Option<number> => {
  return O.map((n: number) => n * 2)(opt);
};

// Uso
const optionValue = O.some(10);
const doubledOption = doubleValue(optionValue); // some(20)
const noneValue = doubleValue(O.none); // none

/*
fromNullable: converte un valore normale in un Option

pipe: permette di concatenare più operazioni su un valore.
In questo caso, partiamo da un valore nullo (null) e lo convertiamo in un Option usando fromNullable.
Poi applichiamo doubleValue due volte per dimostrare come il valore viene trasformato passo dopo passo.

*/
const pipeable = pipe(null, O.fromNullable, doubleValue, doubleValue);

console.log("Passando un valore valido:", doubledOption); // Output: some(20)
console.log("Passando un valore null:", noneValue); // Output: none
console.log("Passando un valore null ad un pipeable:", pipeable); // Output: none
