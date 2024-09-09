import * as t from "io-ts";

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

// Convalida l'oggetto
const validationResult = Persona.decode(personaEsempio);

// Quando il tipo è valido, decode ritorna Right altrimenti Left
console.log(validationResult);
