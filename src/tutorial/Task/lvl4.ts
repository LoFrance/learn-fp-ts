import { pipe } from "fp-ts/lib/function";
import * as T from "fp-ts/Task";

const delay =
  (ms: number): T.Task<number> =>
  () =>
    new Promise((resolve) => setTimeout(() => resolve(ms), ms));

const fetchData =
  (id: number): T.Task<string> =>
  () =>
    pipe(
      // Simuliamo un ritardo di 2 secondi
      delay(2000),
      T.map((x) => `Dati per id: ${id}`)
    )();

const processData =
  (data: string): T.Task<string> =>
  () =>
    pipe(
      // Simuliamo un ritardo di 5 secondi
      delay(5000),
      T.map((x) => `Processato: ${data}`)
    )();

const combinedTask = pipe(
  fetchData(1),
  T.chain((x) =>
    pipe(
      T.of(x),
      T.chainFirst((x) => T.fromIO(() => console.log(`Dopo fetchData: ${x}`)))
    )
  ),
  T.chain(processData)
);

combinedTask().then((result) => {
  console.log(result); // Stampa "Processato: Dati per ID: 1"
});
