import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as path from "path";
import { Planet, Route, TrafficDelay } from "./model";
import FirestoreCollection from "./FirestoreCollection/FirestoreCollection";
import Graph from "./Graph/Graph";
import Node from "./Graph/Node";

admin.initializeApp();

const firestore = admin.firestore();
const storage = admin.storage();

// Exposes a REST endpoint, which determines the shortest path beween the two
// planetsspecified in the query parameters.
//
export const getShortestPath = functions.https.onRequest(
  //TODO: Give the endpoint a proper REST-like name, e.g. "shortest-path".
  //
  async (request, response) => {
    if (request.method === "GET") {
      try {
        // obtain the planets from Firestore,
        const planetsCollection = new FirestoreCollection<Planet>(
          firestore,
          "planets"
        );
        const planets = await planetsCollection.getAllDocuments();

        // obtain the routes from Firestore,
        const routesCollection = new FirestoreCollection<Route>(
          firestore,
          "routes"
        );
        const routes = await routesCollection.getAllDocuments();

        // instantiate a graph of planets,
        const planetsGraph = new Graph<Planet>();

        // add the planet-nodes to the graph,
        planets.map((planet) =>
          planetsGraph.addNode(planet.planetNode, planet)
        );

        // add the route-edges to the graph,
        routes.map((route) =>
          planetsGraph.addEdge(
            route.planetOrigin,
            route.planetDestination,
            route.distance
          )
        );

        // find the shortest path between the specified planets,
        let shortestPath: Array<Node<Planet>>;
        shortestPath = planetsGraph.findShortestPath("A", "B'");

        response.status(200).send(shortestPath);
        //TODO: Limit the depth of the JSON returned, to only the first level.
      } catch (error) {
        response.status(500).send(error);
        //TODO: Construct a more meaningful error message.
        console.log(error);
      }
    }
  }
);

// Handles the "finalize" event, which is triggered after a CSV data file is
// uploaded to Firebase Storage:
//
export const importDataFromCsvFile = functions.storage
  .object()
  .onFinalize(onFinalizeHandler);

// "Finalize" event handler, which takes a CSV data file and imports it into
// its corresponding Firestore collection:
//
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
        // if a planets CSV file was uploaded:
        case "planets.csv":
          const planetsCollection = new FirestoreCollection<Planet>(
            firestore,
            "planets"
          );
          await planetsCollection.importCsvFile(csvFileContents, Planet);
          console.log('Imported "planets.csv" file into the database.');
          break;

        // if a routes CSV file was uploaded:
        case "routes.csv":
          const routesCollection = new FirestoreCollection<Route>(
            firestore,
            "routes"
          );
          await routesCollection.importCsvFile(csvFileContents, Route);
          console.log('Imported "routes.csv" file into the database.');
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
