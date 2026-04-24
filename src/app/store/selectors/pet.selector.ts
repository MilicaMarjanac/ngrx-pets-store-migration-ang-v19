import { createSelector } from "@ngrx/store";
import { PetState } from "../reducers/pet.reducer";

export interface AppState {
  pets: PetState;
}

export const selectFeature = (state: AppState) => {
  return state.pets;
};

export const selectFeaturePets = createSelector(
  selectFeature,
  (state: PetState) => {
    return Object.values(state.entities).sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  }
);
