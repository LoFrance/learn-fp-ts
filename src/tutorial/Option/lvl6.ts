import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";

// Funzione per formattare un saluto
const formatGreeting =
  (name: string) =>
  (age: number): string =>
    `Ciao, mi chiamo ${name} e ho ${age} anni.`;

// Funzione principale che utilizza ap
const createGreeting = (
  optName: O.Option<string>,
  optAge: O.Option<number>
): O.Option<string> => {
  return pipe(O.some(formatGreeting), O.ap(optName), O.ap(optAge));
};

// Esempi di utilizzo
console.log(createGreeting(O.some("Lorenzo"), O.some(30)));
// Output: Some("Ciao, mi chiamo Mario e ho 30 anni.")

console.log(createGreeting(O.some("Mario"), O.none));
// Output: None

console.log(createGreeting(O.none, O.some(25)));
// Output: None

// Funzione per sommare due numeri
const add =
  (a: number) =>
  (b: number): number =>
    a + b;

// Funzione per aggiungere due Option
const addOptions = (
  optA: O.Option<number>,
  optB: O.Option<number>
): O.Option<number> => {
  const optionAB = O.some((a: number) => (b: number) => add(a)(b));
  return pipe(optionAB, O.ap(optA), O.ap(optB));
};

const optionA = O.some(5);
const optionB = O.some(10);
const optionC = O.none;

console.log(addOptions(optionA, optionB)); // Output: some(15)
console.log(addOptions(optionA, optionC)); // Output: none
