import * as T from "fp-ts/Task";

// Funzione che restituisce un Task che risolve dopo un certo tempo
const delay =
  (ms: number): T.Task<number> =>
  () =>
    new Promise((resolve) => setTimeout(() => resolve(ms), ms));

const delayedTask = delay(2000); // Aspetta 2 secondi

delayedTask().then((result) => {
  console.log(`RHo aspettaot ${result} millisecondi!`); // Stampa "Riportato dopo 2000 millisecondi!"
});
