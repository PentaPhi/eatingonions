import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
import { InfoComponent} from './info/info.component';
import { GameComponent} from './game/game.component';
import { MainComponent} from './main/main.component';

const routes: Routes = [
  { path: 'info', component: InfoComponent },
  { path: 'game', component: GameComponent },
  { path: '', component: MainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
