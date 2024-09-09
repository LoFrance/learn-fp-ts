import * as t from "io-ts";
import { pipe } from "fp-ts/function";
import * as E from "fp-ts/Either";

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

pipe(
  personaEsempio,
  Persona.decode,
  // La funzione fold accetta due argomenti: una funzione per il caso di errore e una funzione per il caso di successo.
  E.fold(
    (errors) => {
      console.error("Errore di convalida:", errors);
      return null;
    },
    (validData) => {
      console.log("Persona valida:", validData);
      return validData;
    }
  )
);
