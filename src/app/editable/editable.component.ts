import {
  Component,
  computed,
  contentChild,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  output,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { filter, fromEvent, take } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EditModeDirective } from "../directives/edit-mode.directive";
import { ViewModeDirective } from "../directives/view-mode.directive";

@Component({
  selector: "app-editable",
  templateUrl: "./editable.component.html",
  styleUrls: ["./editable.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class EditableComponent {
  updateField = output<void>();
  viewModeTpl = contentChild.required(ViewModeDirective);
  editModeTpl = contentChild.required(EditModeDirective);

  public editMode = signal(false);

  public host = inject(ElementRef) as ElementRef<HTMLElement>;
  private destroyRef = inject(DestroyRef);

  readonly currentView = computed(() => {
    return this.editMode()
      ? this.editModeTpl().template
      : this.viewModeTpl().template;
  });

  constructor() {
    this.setupEnterEditMode();
    this.setupExitEditMode();
  }

  private get element() {
    return this.host.nativeElement;
  }

  private setupEnterEditMode() {
    fromEvent(this.element, "click")
      .pipe(
        filter(() => !this.editMode()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.editMode.set(true);
      });
  }

  private setupExitEditMode() {
    effect((onCleanup) => {
      if (!this.editMode()) return;
      const clickOutside$ = fromEvent(document, "click").pipe(
        filter(({ target }) => !this.element.contains(target as Node)),
        take(1),
      );

      const subscription = clickOutside$.subscribe(() => {
        this.updateField.emit();
        this.editMode.set(false);
      });
      onCleanup(() => subscription.unsubscribe());
    });
  }
}
