import { Component, OnInit } from "@angular/core";
import { ViewChild, ElementRef } from "@angular/core";
import { PlanetRoutesService } from "../../services/planet-routes.service";
import { Planet } from "../../../../functions/src/model";

@Component({
  selector: "app-route-finder",
  templateUrl: "./route-finder.component.html",
  styleUrls: ["./route-finder.component.scss"],
})
export class RouteFinderComponent implements OnInit {
  planets: Array<Planet> = new Array<Planet>();
  @ViewChild("fromPlanet") fromPlanetSelect: ElementRef;
  @ViewChild("toPlanet") toPlanetSelect: ElementRef;

  constructor(private planetRoutesService: PlanetRoutesService) {}

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
    console.log(fromPlanet);
    console.log(toPlanet);

    // if both planets have been selected:
    if (fromPlanet && toPlanet) {
      // if the same planets have been selected:
      if (fromPlanet === toPlanet) {
        alert(
          "Can only find the shortest route between two different planets. Please select another planet."
        );
        return;
      }
    }
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
        // after ALL the planets have been loaded.
      });
    });
  }
}
