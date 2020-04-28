export class Route {
  routeId: number;
  planetOrigin: string;
  planetDestination: string;
  distance: number;

  constructor(
    routeId: number = 0,
    planetOrigin: string = "",
    planetDestination: string = "",
    distance: number = 0
  ) {
    this.routeId = routeId;
    this.planetOrigin = planetOrigin;
    this.planetDestination = planetDestination;
    this.distance = distance;
  }
}
