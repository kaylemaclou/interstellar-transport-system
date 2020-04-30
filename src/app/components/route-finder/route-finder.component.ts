import { Component, OnInit } from "@angular/core";
import { PlanetRoutesService } from "../../services/planet-routes.service";
import { Planet } from "../../../../functions/src/model";

@Component({
  selector: "app-route-finder",
  templateUrl: "./route-finder.component.html",
  styleUrls: ["./route-finder.component.scss"],
})
export class RouteFinderComponent implements OnInit {
  planets: Array<Planet> = new Array<Planet>();

  constructor(private planetRoutesService: PlanetRoutesService) {}

  ngOnInit(): void {
    this.planetRoutesService.getPlanets().subscribe((planetDocuments) => {
      planetDocuments.map((planetDocument) =>
        this.planets.push(
          new Planet(
            planetDocument.fields.planetNode.stringValue,
            planetDocument.fields.planetName.stringValue
          )
        )
      );

      console.log("Here----------");
      console.log(this.planets);
    });
  }
}
