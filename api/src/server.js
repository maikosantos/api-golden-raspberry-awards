import { app } from "./app.js";
import { readCSVAndSaveToDb } from "./controllers/csvReaderController.js";

(async () => {
  await readCSVAndSaveToDb();

  app.listen(process.env.PORT || 3001, () => {
    console.log(`App is running at port ${process.env.PORT}`);
  });
})();
