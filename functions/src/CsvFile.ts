// Implements the functionality pertaining to a CSV file:
export default class CsvFile<T> {
  private headers: Array<string> = [];
  private dataRows: Array<Array<any>> = [];

  constructor(csvFileContents: string) {
    // Split the CSV file contents into an array of rows, where each row is
    // a line within the CSV file,
    const csvFileRows = csvFileContents.split("\n");

    // obtain the column headers,
    this.headers = csvFileRows[0].split(",");

    // remove the header row,
    csvFileRows.shift();

    // obtain the data rows.
    this.dataRows = csvFileRows.map((row: string) => row.split(","));
  }

  // Converts the input CSV file contents to a JSON array:
  public toJSON(classInstance: T): string {
    // create an array to hold the resulting JavaScript (JSON) objects,
    let jsonObjectArray: Array<T> = new Array<T>();

    // if CSV file's column headers match the properties of an instance of
    // the specified type (T):
    if (this.hasRequiredColumnHeaders(classInstance)) {
      // convert every data row to a corresding JavaScript object:
      jsonObjectArray = this.dataRows.map((rowData: Array<any>) => {
        // create a new empty object instance of the specified type (T),
        // @ts-ignore
        const newObject: T = Object.create(classInstance);

        // populate each property of the new object instance, with its
        // corresponding row data value,
        Object.keys(classInstance).map((key, index) => {
          // @ts-ignore
          newObject[key] = rowData[index];
        });

        return newObject;
      });
    }

    return JSON.stringify(jsonObjectArray);
  }

  // Returns "true" if the CSV file contains column headers matching all the
  // properties of the specified type (T):
  private hasRequiredColumnHeaders(classInstance: T): boolean {
    // Convert headers to camel-case,
    const camelCadesHeaders = this.headers.map((header) =>
      this.toCamelCaseString(header)
    );

    // find header that do not match the properties of the type (T):
    const unmatchedHeaders = Object.keys(classInstance).filter(
      (key, index) => key !== camelCadesHeaders[index]
    );

    return !unmatchedHeaders.length;
  }

  // Modifies the input string to camel-case:
  toCamelCaseString(inputString: string) {
    const outputString: string = inputString
      .toLowerCase()
      .replace(/(?:(^.)|([-_\s]+.))/g, (match: any) =>
        match.charAt(match.length - 1).toUpperCase()
      );

    return outputString.charAt(0).toLowerCase() + outputString.substring(1);
  }
}
