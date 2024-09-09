import { pipe } from "fp-ts/lib/function";
import * as T from "fp-ts/Task";

const fetchData =
  (id: number): T.Task<string> =>
  () =>
    Promise.resolve(`Dati per ID: ${id}`);

const processData =
  (data: string): T.Task<string> =>
  () =>
    Promise.resolve(`Processato: ${data}`);

const combinedTask = pipe(fetchData(1), T.chain(processData));

combinedTask().then((result) => {
  console.log(result); // Stampa "Processato: Dati per ID: 1"
});
