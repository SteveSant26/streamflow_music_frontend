import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MusicsTable } from "../../components/musics-table/musics-table";

@Component({
  selector: "app-explore",
  standalone: true,
  imports: [CommonModule, MusicsTable],
  templateUrl: "./explore.html",
  styleUrl: "./explore.css",
})
export class ExploreComponent {
  genres = ["Rock", "Pop", "Jazz", "Electronic", "Hip Hop", "Classical"];

  constructor() {}
}
