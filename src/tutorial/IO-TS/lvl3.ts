import * as t from "io-ts";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";
import * as TE from "fp-ts/TaskEither";

// Dichiara un tipo Persona
const Persona = t.type({
  nome: t.string,
  eta: t.number,
  email: t.string,
});

// Esempio di oggetto da validare
const personaEsempio = {
  nome: "Mario Rossi",
  eta: 30,
  email: "mario.rossi@example.com",
};

const fakeHTTPRequest = (data: any) => {
  return new Promise((resolve) => {
    resolve(data);
  });
};

pipe(
  // Il TE.tryCatch ci permette di convertire un'operazione asincrona in un TE
  TE.tryCatch(
    () => fakeHTTPRequest(personaEsempio),
    (error) => new Error(String(error))
  ),
  // La chain è necessaria per poter concatenare i TE, in questo modo possiamo fare una serie di operazioni in cascata
  TE.chain((data) =>
    pipe(
      // Qui validiamo il dato rispetto al tipo Persona
      Persona.decode(data),
      // La validazione può fallire, in quel caso ritorniamo un errore
      // La validazione torna un Either, quindi possiamo usarlo per decidere cosa fare con E.fold
      // La E.fold estrae il valore da un Either, in questo caso se la validazione ha successo ritorniamo il dato validato, altrimenti ritorniamo un errore
      E.fold(
        (errors) =>
          TE.left(
            new Error("Errore di validazione: " + JSON.stringify(errors))
          ),
        (validData) => TE.right(validData)
      )
    )
  ),
  TE.mapLeft((error) => {
    console.error("Errore di chiamata HTTP:", error);
    return error;
  }),
  // Il TE.toUnion ci permette di convertire il TE in un tipo unione che può essere usato con .then
  TE.toUnion
)().then(
  (result) => console.log("Risultato:", result),
  (error) => console.error("Errore finale:", error)
);
