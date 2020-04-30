import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { RouteFinderComponent } from "./components/route-finder/route-finder.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, RouteFinderComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
