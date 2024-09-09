/*
In questo esempio vediamo come utilizzare la funzione fold per gestire l'Option e la concatenazione di funzioni con pipe.

- fold è una funzione che prende un Option e una funzione e applica la funzione al valore dell'Option se l'Option è Some, altrimenti applica la funzione a None.

- pipe è una funzione che prende un valore e una funzione e applica la funzione al valore.
*/
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";

/*
In questo esempio, abbiamo una funzione getRandomValue che restituisce un number o un null. Se il valore è maggiore di 0.5, restituiamo 10, altrimenti restituiamo null.
*/

const getRandomValue = () => (Math.random() > 0.5 ? 10 : null);

const main = () => {
  pipe(
    getRandomValue(),
    O.fromNullable, // fromNullable è una funzione che prende un valore e restituisce un Option. Se il valore è null, restituisce None, altrimenti restituisce Some(valore).
    O.fold(
      () => console.log("È stato generato un valore nullo"),
      (x) => console.log(`Esiste un valore ed è ${x}`)
    )
  );
};

main();
