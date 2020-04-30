import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PlanetRoutesService {
  constructor(private http: HttpClient) {}

  planetsUri: string = `https://firestore.googleapis.com/v1/projects/interstellar-transport-system/databases/(default)/documents/planets`;
  //TODO: Move these URIs to a dev/test/prod environment constants file.

  // Obtains the list of Planet Documents, from the Firestore NoSql database's
  // Planets collection, via the default REST GET endpoint:
  getPlanets(): Observable<any> {
    return this.http
      .get<Response>(this.planetsUri)
      .pipe(map((response: Response) => response["documents"]));

    // .pipe(
    //   map(
    //     (documents) =>
    //       new Planet(
    //         documents["fields"].planetNode.stringValue,
    //         documents["fields"].planetName.stringValue
    //       )
    //   )
    // );

    //TODO: Do proper error handling.
  }

  // getPlanets(): Observable<Planet> {
  //   return this.http.get<Planet>(this.planetsUri).pipe(
  //     tap((responseData: any) =>
  //       responseData.documents.map(
  //         (document) =>
  //           new Planet(
  //             document.fields.planetNode.stringValue,
  //             document.fields.planetName.stringValue
  //           )
  //       )
  //     )
  //   );
  //   //TODO: Do proper error handling.
  // }

  // getGames(): Observable<IGame[]> {
  //   return this.http.get<IGame[]>(this.gameUrl).pipe(
  //       tap(data => console.log('All: ' + JSON.stringify(data))),
  //       catchError(this.handleError)
  //   );
}
