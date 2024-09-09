import { flow } from "fp-ts/lib/function";
import * as O from "fp-ts/Option";

/*
* getOrElse: restituisce il valore di Option se è Some, altrimenti restituisce il valore di default

flow: è una funzione che prende una funzione e un valore e restituisce un valore
*/
const displayValue = (opt: O.Option<string>): string =>
  flow(
    // Prendiamo il valore di Option, se è None, restituisce 'Nessun valore fornito'
    O.getOrElse(() => "Nessun valore fornito"),
    // adesso abbiamo una stringa
    (value: string) => `Il valore è: ${value}`
  )(opt);

const valueSome = O.some("Hello FP-TS");
const valueNone = O.none;

console.log(`passiamo un valore some: ${displayValue(valueSome)}`); // Output: Il valore è: Hello FP-TS
console.log(`passiamo un valore none: ${displayValue(valueNone)}`); // Output: Nessun valore fornito
