import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { StoreModule } from "@ngrx/store";
import { AppComponent } from "./app.component";
import { ViewModeDirective } from "./directives/view-mode.directive";
import { EditModeDirective } from "./directives/edit-mode.directive";
import { EditableComponent } from "./editable/editable.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { petsReducer } from "./store/reducers/pet.reducer";
import { EffectsModule } from "@ngrx/effects";
import { PetEffects } from "./store/effects/pet.effects";

@NgModule({ declarations: [
        AppComponent,
        ViewModeDirective,
        EditModeDirective,
        EditableComponent,
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forRoot({ pets: petsReducer }),
        EffectsModule.forRoot([PetEffects])], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {}
