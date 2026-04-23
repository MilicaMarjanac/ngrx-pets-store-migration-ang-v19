import {
  Component,
  ContentChild,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  output,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { filter, fromEvent, Subject, switchMap, take, takeUntil } from "rxjs";
import { EditModeDirective } from "../directives/edit-mode.directive";
import { ViewModeDirective } from "../directives/view-mode.directive";

@Component({
  selector: "app-editable",
  templateUrl: "./editable.component.html",
  styleUrls: ["./editable.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class EditableComponent implements OnInit, OnDestroy {
  updateField = output<void>();
  @ContentChild(ViewModeDirective) viewModeTpl: ViewModeDirective;
  @ContentChild(EditModeDirective) editModeTpl: EditModeDirective;

  public mode: "view" | "edit" = "view";
  public notifier$: Subject<void> = new Subject();
  public editMode: Subject<boolean> = new Subject();
  public editMode$ = this.editMode.asObservable();

  public host = inject(ElementRef) as ElementRef<HTMLElement>;
  public get currentView() {
    return this.mode === "view"
      ? this.viewModeTpl.template
      : this.editModeTpl.template;
  }

  ngOnInit() {
    this.handleViewMode();
    this.handleEditMode();
  }

  ngOnDestroy(): void {
    this.notifier$.next();
    this.notifier$.complete();
  }

  private get element() {
    return this.host.nativeElement;
  }

  private handleViewMode() {
    fromEvent(this.element, "click")
      .pipe(takeUntil(this.notifier$))
      .subscribe(() => {
        this.mode = "edit";
        this.editMode.next(true);
      });
  }

  private handleEditMode() {
    const clickOutside$ = fromEvent(document, "click").pipe(
      filter(({ target }) => this.element.contains(target as Node) === false),
      take(1),
    );

    this.editMode$
      .pipe(
        switchMap(() => clickOutside$),
        takeUntil(this.notifier$),
      )
      .subscribe(() => {
        this.updateField.emit();
        this.mode = "view";
      });
  }
}
