import { Component } from "@angular/core";
import { ViewService } from "../shared/view.service";

@Component({
  selector: "card",
  styleUrls: ["./card.component.css"],
  templateUrl: "./card.component.html"
})
export class CardComponent {
  constructor(public viewService: ViewService) {}
}
