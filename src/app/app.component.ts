import { CommonModule } from "@angular/common";
import { Component, OnInit, effect, inject, signal } from "@angular/core";
import { Store } from "@ngrx/store";
import { addPet, loadPets, updatePet } from "./store/actions/pet.actions";
import { AppState, selectFeaturePets } from "./store/selectors/pet.selector";
import { EditableComponent } from "./editable/editable.component";
import { ViewModeDirective } from "./directives/view-mode.directive";
import { EditModeDirective } from "./directives/edit-mode.directive";

type PetDraft = {
  id: number | null;
  name: string;
  type: string;
};

type EditablePetDraftField = keyof Pick<PetDraft, "name" | "type">;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
  ],
})
export class AppComponent implements OnInit {
  private store = inject(Store<AppState>);
  readonly pets = this.store.selectSignal(selectFeaturePets);
  readonly draftPets = signal<PetDraft[]>([]);

  constructor() {
    effect(() => {
      const pets = this.pets();

      this.draftPets.set(
        pets.map((p) => ({
          id: p.id ?? null,
          name: p.name,
          type: p.type,
        })),
      );
    });
  }

  ngOnInit() {
    this.store.dispatch(loadPets());
  }

  updateField(pet: PetDraft, field: EditablePetDraftField, value: string) {
    this.draftPets.update((list) =>
      list.map((p) => (p === pet ? { ...p, [field]: value } : p)),
    );
  }

  addNewPet() {
    this.draftPets.update((list) => [
      ...list,
      {
        id: null,
        name: "Add name",
        type: "Add type",
      },
    ]);
  }

  savePet(pet: PetDraft) {
    if (!pet.name || !pet.type) return;

    if (!pet.id) {
      this.store.dispatch(
        addPet({
          pet: {
            name: pet.name,
            type: pet.type,
          },
        }),
      );
    } else {
      this.store.dispatch(
        updatePet({
          pet: {
            id: pet.id,
            name: pet.name,
            type: pet.type,
          },
        }),
      );
    }
  }
}
