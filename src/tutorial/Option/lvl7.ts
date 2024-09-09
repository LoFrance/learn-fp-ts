import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

// parseNumber prova a convertire una stringa in un numero. Se la stringa non è un numero valido, restituisce O.none, altrimenti restituisce O.some(n).
const parseNumber = (s: string): O.Option<number> => {
  const n = parseFloat(s);
  return Number.isNaN(n) ? O.none : O.some(n);
};

// addParsedNumbers somma due numeri. Se uno dei due numeri non è valido, restituisce O.none, altrimenti restituisce O.some(n).
const addParsedNumbers = (str1: string, str2: string): O.Option<number> => {
  return pipe(
    parseNumber(str1),
    O.chain((num1: number) =>
      pipe(
        parseNumber(str2),
        O.chain((num2: number) => O.some(num1 + num2))
      )
    )
  );
};

const result1 = addParsedNumbers("3.5", "2.5");
const result2 = addParsedNumbers("3.5", "abc");

console.log(result1); // Output: some(6)
console.log(result2); // Output: none
