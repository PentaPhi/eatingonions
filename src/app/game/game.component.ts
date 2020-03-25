import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//The Api return values
export interface Config {
  txt: string;
  url: string;
  source: string;
  sourceurl: string;
  correct: number;
  facttxt: string;
  fictiontxt: string;
  factrewad: string;
  fictionreward: string;
}

//navigator declared for internet checks
declare var navigator;
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {
    //A bunch of switches for css animations and layering
    rebootSwitch = false;
    doneSwitch = true;
    imageSwitch = true;
    noInternet = false;
    preloadNeeded = false;

    pointsWrong = 0;
    pointsTrue = 0;
    messageOne:string;
    messageTwo:string;
    imageUrl:string = "/img/default.png";
    img:any;
    //initialize empty
    use: Config = {} as Config;
    preload: Config;


  preloadData(){
    this.http.get("/api")
    .subscribe(
      (data: Config) =>{
      this.preload = data;
      //hacky Image preload
      this.img = new Image();
      this.img.src = data.url;

      this.preloadNeeded = false;
    });
  }

  async update(){
    //deactivate "done" Dialog
    this.doneSwitch = true;

    //check internet connectivity
    if(this.preloadNeeded && navigator.connection.downlink == 0){
      this.noInternet = true;
    }else {
      if(this.preloadNeeded ){
        var count = 0;
        console.log("mhm")
        while(this.preloadNeeded && count < 6){
          await new Promise((res,rej) =>{
            setTimeout(() =>{this.preloadData();res()},500)
          })
          count += 1;
        }
        if(this.preloadNeeded){
          this.noInternet = true;
        }
      }
      if(!this.preloadNeeded){
        this.use = this.preload;
        this.rebootSwitch = true;
        this.imageSwitch = false;

        setTimeout((url) => {
          this.imageSwitch = true;
          this.imageUrl = this.use.url;
        }, 500, this.preload.url);

        this.preloadNeeded = true;
        this.preloadData();
      }
    }
  }


  fact(){
    this.done(true);
  }
  fiction(){
    this.done(false);
  }

  done(value:boolean){
    this.rebootSwitch = false;
      this.doneSwitch = false;
    if(value == (this.use.correct == 1)){
      this.pointsTrue++;
      this.messageOne = "You are correct!🎉";
      this.messageTwo = this.use.factrewad;
    }else{
      this.pointsWrong++;
      this.messageOne = "You are incorrect :/";
      this.messageTwo = this.use.fictionreward;
    }
  }

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {

    var timout = setTimeout(() => {
      if(!this.rebootSwitch)
      this.noInternet = true;
    },5000);

    this.http.get("/api").subscribe((data: Config) =>{
      this.use = data;
      this.imageUrl = data.url;
      this.rebootSwitch = true;
      clearTimeout(timout);
    });

    this.preloadData();

  }

}
