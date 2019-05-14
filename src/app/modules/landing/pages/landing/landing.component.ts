import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  images= [
    '/assets/images/GuildWars2-05-1920x1200.jpg',
    '/assets/images/GuildWars2-07-1920x1200.jpg',
    '/assets/images/GuildWars2-13-1920x1200.jpg',
    '/assets/images/218560-fantasy_art-concept_art-Guild_Wars-Guild_Wars_2-video_games.jpg',
  ];
  
  constructor() { }

  ngOnInit() {
  }

}
