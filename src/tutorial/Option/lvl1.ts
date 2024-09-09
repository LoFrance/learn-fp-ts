/*
Option è un tipo di dato che può essere Some(value) o None.
some è una funzione che prende un valore e restituisce Some(value).
none è una funzione che non prende argomenti e restituisce None.    
*/
import * as O from "fp-ts/Option";

/*
In questo esempio, abbiamo una funzione getOptionValue che prende un numero e restituisce un Option<number>. Se il numero è maggiore di 0, restituisce Some(numero), altrimenti restituisce None.
*/
const getOptionValue = (value: number): O.Option<number> => {
  return value > 0 ? O.some(value) : O.none;
};

// Vediamo l'uso della funzione getOptionValue e i valori some e none
const optionPositive = getOptionValue(5); // some(5)
const optionNegative = getOptionValue(-5); // none

console.log(optionPositive); // Output: some(5)
console.log(optionNegative); // Output: none
