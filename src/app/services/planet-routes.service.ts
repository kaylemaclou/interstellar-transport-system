import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Planet } from "../../../functions/src/model";
import Node from "../../../functions/src/Graph/Node";

@Injectable({
  providedIn: "root",
})
export class PlanetRoutesService {
  constructor(private http: HttpClient) {}

  planetsUri: string = `https://firestore.googleapis.com/v1/projects/interstellar-transport-system/databases/(default)/documents/planets`;
  shortestPathUri: string = `https://us-central1-interstellar-transport-system.cloudfunctions.net/getShortestPath`;
  //TODO: Move these URIs to a dev/test/prod environment constants file.

  // Obtains the shortest path/route between the two specified planets, using
  // the corresponding REST API Firstbase Function endpoint:
  getShortestPath(
    fromPlanet: string,
    toPlanet: string
  ): Observable<Array<Node<Planet>>> {
    // concatenate the required URI,
    const shortestPathUri = `${this.shortestPathUri}?from-planet=${fromPlanet}&to-planet=${toPlanet}`;

    // make the call to the API and return the data.
    return this.http.get<Array<Node<Planet>>>(shortestPathUri).pipe(
      tap((data) => {
        return data;
      })
    );
    //TODO: Implement proper error handling.
  }

  // Obtains the list of Planet Documents, from the Firestore NoSql database's
  // Planets collection, via the default REST GET endpoint:
  getPlanets(): Observable<any> {
    return this.http
      .get<Response>(this.planetsUri)
      .pipe(map((response: Response) => response["documents"]));
    //TODO: Implement proper error handling.
  }
}
