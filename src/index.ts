import { pipe } from "fp-ts/lib/function";
import fs from "fs";
import path from "path";
import * as TE from "fp-ts/TaskEither";
import * as Arr from "fp-ts/Array";
import { spawnSync } from "child_process";

const srcDir: string = path.join(__dirname, "./tutorial");

async function getDirectories(source: string): Promise<Error | Array<string>> {
  return pipe(
    // `TE.tryCatch` tenta di eseguire un'operazione asincrona (lettura della directory).
    // Se l'operazione fallisce, restituisce un errore racchiuso in un TaskEither.
    TE.tryCatch(
      () => fs.promises.readdir(source, { withFileTypes: true }),
      (error) => new Error(`Error reading directory: ${error}`)
    ),
    // TE.chain permette di processare il risultato dell'operazione precedente.
    // Qui, filtriamo le voci della directory per mantenere solo le directory.
    TE.chain((dirs) => {
      return pipe(
        dirs,
        // Arr.filter filtra gli elementi dell'array in base alla condizione specificata. In questo caso, filtra solo le directory.
        Arr.filter((dir) => dir.isDirectory()),
        // Arr.map trasforma gli elementi dell'array in base alla funzione specificata. In questo caso, prende il nome delle directory.
        Arr.map((dir) => dir.name),
        // TE.fromPredicate verifica se l'array non è vuoto. Se lo è, restituisce un errore.
        TE.fromPredicate(
          Arr.isNonEmpty,
          () => new Error("No directories found")
        )
      );
    }),
    //   // `TE.toUnion` converte il tipo TaskEither in una unione di tipi (Error | Array<string>).
    TE.toUnion
  )();
}

function getFiles(source: string): Promise<Error | Array<string>> {
  return pipe(
    TE.tryCatch(
      // TaskEither.tryCatch tenta di eseguire un'operazione asincrona (lettura della directory).
      // Se l'operazione fallisce, restituisce un errore racchiuso in un TaskEither.
      () => fs.promises.readdir(source, { withFileTypes: true }),
      (error) => new Error(`Error reading directory: ${error}`)
    ),
    // Uso TE.chain per processare il risultato dell'operazione precedente.
    TE.chain((dirs) => {
      return pipe(
        dirs,
        // Filtra solo i file che terminano con ".ts".
        Arr.filter((dir) => dir.isFile() && dir.name.endsWith(".ts")),
        // Mappa i risultati per ottenere solo i nomi dei file.
        Arr.map((dir) => dir.name),
        // Converte l'array di nomi di file in un TaskEither.
        TE.of,
        // Gestisce eventuali errori durante la lettura della directory.
        TE.fold(
          (error) => TE.left(new Error(`Error reading directory: ${error}`)),
          (files) => TE.right(files)
        )
      );
    }),
    // Converte il TaskEither in una Promise che restituisce un errore o un array di file.
    TE.toUnion
  )(); // L'esecuzione è necessaria per eseguire l'operazione asincrona.
}

function promptUser(question: string): Promise<string> {
  return new Promise<string>((resolve) => {
    process.stdout.write(question);
    process.stdin.once("data", (data: Buffer) => {
      resolve(data.toString().trim());
    });
  });
}

async function selectFile(): Promise<void> {
  const maxRetries = 3;
  let attempts = 0;
  let letsDoAnotherTime = false;

  while (attempts < maxRetries && !letsDoAnotherTime) {
    try {
      const foldersResult = await getDirectories(srcDir);
      if (foldersResult instanceof Error) throw foldersResult;
      const folders = foldersResult;

      console.log("Seleziona un tipo FP-TS:");
      folders.forEach((folder: string, index: number) => {
        console.log(`${index + 1}. ${folder}`);
      });

      const folderIndex: string = await promptUser(
        "Inserisci il numero della cartella: "
      );
      const parsedFolderIndex = parseInt(folderIndex);
      if (
        parsedFolderIndex <= 0 ||
        parsedFolderIndex > folders.length ||
        Number.isNaN(parsedFolderIndex)
      )
        throw new Error("Cartella non valida");

      const selectedFolder: string = folders[parsedFolderIndex - 1];

      const fileResults = await getFiles(path.join(srcDir, selectedFolder));
      if (fileResults instanceof Error) throw fileResults;
      const files = fileResults;

      console.log("Seleziona un livello:");
      files.forEach((file: string, index: number) => {
        console.log(`Livello ${index + 1}: ${file}`);
      });

      const fileIndex: string = await promptUser(
        "Inserisci il numero del livello: "
      );
      const parsedFileIndex = parseInt(fileIndex);
      if (
        parsedFileIndex <= 0 ||
        parsedFileIndex > files.length ||
        Number.isNaN(parsedFolderIndex)
      )
        throw new Error("Livello non valido");
      const selectedFile: string = files[parsedFileIndex - 1];

      const filePath: string = path.join(srcDir, selectedFolder, selectedFile);
      console.log(`Eseguendo il livello: ${filePath}`);

      // Esegui il file con ts-node

      const result = spawnSync("ts-node", [filePath], { stdio: "inherit" });
      if (result.error) {
        console.error("Errore di esecuzione:", result.error);
      } else {
        console.log(
          "Esecuzione completata con codice di uscita:",
          result.status
        );
      }

      // Resetta il numero di tentativi
      attempts = 0;

      // Chiedi all'utente se vuole continuare
      const continueExecution = await promptUser("Vuoi continuare? (s/n)");
      if (continueExecution === "n") {
        letsDoAnotherTime = true;
      }
    } catch (error: any) {
      attempts++;
      console.error(
        `Errore: ${error.message}. Hai ${
          maxRetries - attempts
        } tentativi rimanenti.`
      );
      if (attempts >= maxRetries) {
        console.error(
          "Numero massimo di tentativi raggiunto. Uscita dal programma."
        );
        process.exit(1);
      }
    }
  }
  console.log("Uscita dal programma.");
  process.exit(0);
}

selectFile().catch((error: Error) => console.error(error));
