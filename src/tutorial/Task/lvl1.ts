import * as T from "fp-ts";

/*
Andiamo a creare una funzione che ritorna un Task
*/
const simpleTask = T.task.of(42);

const main = async () => {
  const res = await simpleTask();
  console.log(res);
};

main();
