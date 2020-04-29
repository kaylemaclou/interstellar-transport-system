import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as path from "path";
import { Planet, Route, TrafficDelay } from "./model";
import FirestoreCollection from "./FirestoreCollection/FirestoreCollection";

admin.initializeApp();

const firestore = admin.firestore();
const storage = admin.storage();

//TODO: Give the endpoint a proper REST-like name, e.g. "shortest-path".
export const getShortestPath = functions.https.onRequest(
  async (request, response) => {
    console.log("this is my nice message!!!");
    if (request.method === "GET") {
      //const newRoute = request.query.newRoute;

      const routes = await firestore
        .collection("routes")
        .doc("olSl6JvhiP4uStUIH2pp");

      routes
        .get()
        .then((document) => response.send(document.data()))
        .catch((error) => console.log(error));
    }
    //else
    //TODO: Handle errors elegantly.
  }
);

// Handles the "finalize" event, which is triggered after a CSV data file is
// uploaded to Firebase Storage:
export const importDataFromCsvFile = functions.storage
  .object()
  .onFinalize(onFinalizeHandler);

// "Finalize" event handler, which takes a CSV data file and imports it into
// its corresponding Firestore collection:
async function onFinalizeHandler(object: any) {
  // If a CSV file was uploaded:
  if (object.contentType === "text/csv") {
    const fileName: any = path.basename(object.name || "");
    console.log("fileName = ", fileName);

    try {
      // obtain the CSV file that was uploaded,
      const csvFile: any = await storage
        .bucket(object.bucket)
        .file(fileName)
        .download();

      // obtain the contents of the uploaded CSV file,
      const csvFileContents = csvFile.toString();

      console.log("csvFileContents  = ", csvFileContents);

      // Import the uploaded CSV file into its associated Firestore collection:
      switch (fileName) {
        // if a routes CSV file was uploaded:
        case "routes.csv":
          const routesCollection = new FirestoreCollection<Route>(
            firestore,
            "routes"
          );
          await routesCollection.importCsvFile(csvFileContents, Route);
          console.log('Imported "routes.csv" file into the database.');
          break;

        // if a planets CSV file was uploaded:
        case "planets.csv":
          const planetsCollection = new FirestoreCollection<Planet>(
            firestore,
            "planets"
          );
          await planetsCollection.importCsvFile(csvFileContents, Planet);
          console.log('Imported "planets.csv" file into the database.');
          break;

        case "traffic-delays.csv":
          const trafficDelaysCollection = new FirestoreCollection<TrafficDelay>(
            firestore,
            "traffic-delays"
          );
          await trafficDelaysCollection.importCsvFile(
            csvFileContents,
            TrafficDelay
          );
          console.log('Imported "traffic-delays.csv" file into the database.');
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(
        `Error importing data from ${fileName} file. ${error.message}`
      );
    }
  }
}
