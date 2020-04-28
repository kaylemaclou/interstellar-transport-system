export class TrafficDelay {
  routeId: number;
  planetOrigin: string;
  planetDestination: string;
  trafficDelay: number;

  constructor(
    routeId: number = 0,
    planetOrigin: string = "",
    planetDestination: string = "",
    trafficDelay: number = 0
  ) {
    this.routeId = routeId;
    this.planetOrigin = planetOrigin;
    this.planetDestination = planetDestination;
    this.trafficDelay = trafficDelay;
  }
}
