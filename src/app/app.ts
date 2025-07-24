import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AsideMenu } from "./components/aside-menu/aside-menu";
import { Card } from "./components/card/card";
import { Greeting } from "./components/greeting/greeting";
import { MusicsTable } from "./components/musics-table/musics-table";
import { Player } from "./components/player/player";
import { PlayListItemCard } from "./components/play-list-item-card/play-list-item-card";

@Component({
  selector: "app-root",
  imports: [
    RouterOutlet,
    AsideMenu,
    Card,
    Greeting,
    MusicsTable,
    Player,
    PlayListItemCard,
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  // Mock data para las playlists
  featuredPlaylists = [
    {
      id: 101,
      cover: "/assets/playlists/playlist1.jpg",
      title: "Hits del Rock",
      artists: ["Queen", "Led Zeppelin", "The Beatles"],
      color: "#ff6b6b",
    },
    {
      id: 102,
      cover: "/assets/playlists/playlist2.webp",
      title: "Pop Latino",
      artists: ["Shakira", "Jesse & Joy", "Maná"],
      color: "#4ecdc4",
    },
    {
      id: 103,
      cover: "/assets/playlists/playlist3.jpg",
      title: "Jazz Clásico",
      artists: ["Miles Davis", "John Coltrane", "Bill Evans"],
      color: "#45b7d1",
    },
    {
      id: 104,
      cover: "/assets/playlists/playlist4.jpg",
      title: "Chill Vibes",
      artists: ["Bon Iver", "The Paper Kites", "Iron & Wine"],
      color: "#96ceb4",
    },
    {
      id: 105,
      cover: "/assets/playlists/playlist1.jpg",
      title: "Electronic Mix",
      artists: ["Daft Punk", "Justice", "Moderat"],
      color: "#feca57",
    },
    {
      id: 106,
      cover: "/assets/playlists/playlist2.webp",
      title: "Indie Folk",
      artists: ["Fleet Foxes", "Father John Misty", "Big Thief"],
      color: "#ff9ff3",
    },
  ];
}
