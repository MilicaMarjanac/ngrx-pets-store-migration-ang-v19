import { CommonModule } from "@angular/common";
import { Component, OnInit, effect, inject } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Pet } from "./models/pet";
import { Store } from "@ngrx/store";
import { addPet, loadPets, updatePet } from "./store/actions/pet.actions";
import { AppState, selectFeaturePets } from "./store/selectors/pet.selector";
import { EditableComponent } from "./editable/editable.component";
import { ViewModeDirective } from "./directives/view-mode.directive";
import { EditModeDirective } from "./directives/edit-mode.directive";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditableComponent,
    ViewModeDirective,
    EditModeDirective,
  ],
})
export class AppComponent implements OnInit {
  public form: FormGroup;

  private store = inject(Store<AppState>);
  readonly pets = this.store.selectSignal(selectFeaturePets);
  private formBuilder = inject(FormBuilder);
  constructor() {
    this.form = this.formBuilder.group({
      pets: this.formBuilder.array([]),
    });

    effect(() => {
      const pets = this.pets();
      const formArray = this.petsFormArray;

      for (const pet of pets) {
        const existing = this.getFormGroupById(pet.id!);

        if (!existing) {
          formArray.push(
            this.formBuilder.group({
              id: [pet.id],
              name: [pet.name],
              type: [pet.type],
            }),
          );
        } else {
          if (!existing.dirty) {
            existing.patchValue(
              {
                name: pet.name,
                type: pet.type,
              },
              { emitEvent: false },
            );
          }
        }
      }

      const petIds = new Set(pets.map((p) => p.id));

      for (let i = formArray.length - 1; i >= 0; i--) {
        const id = formArray.at(i).value.id;
        if (!petIds.has(id)) {
          formArray.removeAt(i);
        }
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(loadPets());
  }

  public addPetFormField() {
    const petsFormField = this.formBuilder.group({
      id: [null],
      name: ["Pet name", Validators.required],
      type: ["Pet type", Validators.required],
    });
    this.petsFormArray.push(petsFormField);
  }

  private onAdd(pet: Pet) {
    this.store.dispatch(addPet({ pet }));
  }

  private onEdit(pet: Pet) {
    this.store.dispatch(updatePet({ pet }));
  }

  public get petsFormArray() {
    return this.form.controls["pets"] as FormArray;
  }

  private getFormGroupById(id: number | null): FormGroup | undefined {
    return this.petsFormArray.controls.find(
      (c) => c.value.id === id,
    ) as FormGroup;
  }

  public updateField(id: number | null) {
    const pets = this.pets();
    const formGroup = this.getFormGroupById(id);
    if (!formGroup) return;
    const value = formGroup.value;
    const original = pets.find((p) => p.id === id);

    if (!original) {
      if (!value.name || !value.type) return;

      const newPet: Pet = {
        name: value.name,
        type: value.type,
      };

      this.onAdd(newPet);
      return;
    }

    if (original.name === value.name && original.type === value.type) {
      return;
    }

    if (id === null) return;

    const editedPet: Pet = {
      id,
      name: value.name,
      type: value.type,
    };

    this.onEdit(editedPet);
  }
}
