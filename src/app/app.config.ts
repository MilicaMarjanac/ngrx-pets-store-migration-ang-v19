import { ApplicationConfig } from "@angular/core";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideStore } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";

import { petsReducer } from "./store/reducers/pet.reducer";
import { PetEffects } from "./store/effects/pet.effects";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideStore({ pets: petsReducer }),
    provideEffects(PetEffects),
  ],
};
