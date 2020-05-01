import { Component, OnInit } from "@angular/core";
import { ViewChild, ElementRef } from "@angular/core";
import { PlanetRoutesService } from "../../services/planet-routes.service";
import { Planet } from "../../../../functions/src/model";
import Node from "../../../../functions/src/Graph/Node";

@Component({
  selector: "app-route-finder",
  templateUrl: "./route-finder.component.html",
  styleUrls: ["./route-finder.component.scss"],
})
export class RouteFinderComponent implements OnInit {
  planets: Array<Planet>;
  shortestRoute: Array<Node<Planet>>;
  isRouteFound: boolean = false;
  @ViewChild("fromPlanet") fromPlanetSelect: ElementRef;
  @ViewChild("toPlanet") toPlanetSelect: ElementRef;

  constructor(private planetRoutesService: PlanetRoutesService) {
    this.planets = new Array<Planet>();
    this.shortestRoute = new Array<Node<Planet>>();
  }

  ngOnInit(): void {
    // Populate the to and from Planets Select boxes with the list of planets.
    this.populatePlanetSelects();
  }

  // Finds the short route between the from and to planets, which are specified
  // in the Select boxes:
  findShortestRoute() {
    const fromPlanetSelect = this.fromPlanetSelect.nativeElement;
    const toPlanetSelect = this.toPlanetSelect.nativeElement;

    // obtain the to and from planets that have been selected:
    const fromPlanet =
      fromPlanetSelect.options[fromPlanetSelect.selectedIndex].value;
    const toPlanet = toPlanetSelect.options[toPlanetSelect.selectedIndex].value;

    // indicate that a route has not been found, as yet;
    this.isRouteFound = false;

    // reset the route found array,
    this.shortestRoute = new Array<Node<Planet>>();

    // do nothing, if both planets have NOT been selected:
    if (!(fromPlanet && toPlanet)) {
      return;
    }

    // do nothing, if the same planets have been selected for both to and from:
    if (fromPlanet === toPlanet) {
      alert(
        "The shortest route can only be found between two different planets. Please select another planet."
      );
      return;
    }

    // obtain the shortest path/route between the two specified planets,
    this.planetRoutesService
      .getShortestPath(fromPlanet, toPlanet)
      .subscribe((shortestRoute: Array<Node<Planet>>) => {
        this.shortestRoute = shortestRoute;

        // Determine if a route has been successfully found, by checking the
        // start and end planets of the route that was found:
        if (
          this.shortestRoute[0]["planetNode"] === fromPlanet &&
          shortestRoute[shortestRoute.length - 1]["planetNode"] === toPlanet
        )
          this.isRouteFound = true;
        else this.isRouteFound = false;
      });

    //TODO: Implement proper error handling.
  }

  // Populates the to and from Planets Select boxes with the list of planets:
  populatePlanetSelects() {
    this.planetRoutesService.getPlanets().subscribe((planetDocuments) => {
      planetDocuments.map((planetDocument) => {
        // add the new planet, to the list of planets,
        this.planets.push(
          new Planet(
            planetDocument.fields.planetNode.stringValue,
            planetDocument.fields.planetName.stringValue
          )
        );
        // ensure the list of planets remains sorted.
        this.planets.sort((a, b) => (a.planetName > b.planetName ? 1 : -1));
        //TODO: Move the above sort elsewhere, where it is only performed once,
        //      after ALL the planets have been loaded.
      });
    });

    //TODO: Implement proper error handling.
  }
}
