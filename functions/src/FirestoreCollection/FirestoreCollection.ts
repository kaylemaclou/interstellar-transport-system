import CsvFile from "./CsvFile";

// Implements the functionality required for Firestore collections:
export default class FirestoreCollection<T> {
  private firestore: any;
  private pathToCollection: string;

  constructor(firestore: any, pathToCollection: string = "") {
    this.firestore = firestore;
    this.pathToCollection = pathToCollection;
  }

  // Imports the specified CSV file contents into the collection:
  async importCsvFile(csvFileContents: string, typeClass: { new (): T }) {
    const csvFile = new CsvFile<T>(csvFileContents);

    // convert the CSV file to JSON, for the specified type T,
    const jsonData: string = csvFile.toJSON(new typeClass());

    // deletes all the existing documents within the collection,
    await this.deleteAllDocuments();

    // convert the JSON into a JavaScript array of objects of type T,
    const documents: Array<T> = JSON.parse(jsonData);

    // add the specified documents to the collection.
    this.addDocuments(documents);
  }

  // Adds the specified list of documents to the collection:
  addDocuments(documents: Array<T>) {
    documents.map((document) =>
      this.firestore.collection(this.pathToCollection).add(document)
    );
  }

  // Deletes all the currently existing documents within the collection:
  async deleteAllDocuments() {
    // Get a new write batch,
    const batch = this.firestore.batch();
    // delete all the documents within the collection, as a batch.
    await this.firestore
      .collection(this.pathToCollection)
      .listDocuments()
      .then(async (documents: any) => {
        documents.map((document: any) => {
          batch.delete(document);
        });
        await batch.commit();
      });
  }

  // Obtains all the documents within the collection:
  async getAllDocuments() {
    const query = await this.firestore.collection(this.pathToCollection).get();
    const documents = await query.docs;
    const data: Array<T> = documents.map((document: any) => document.data());
    return data;
  }
}
