import { Directive, inject, TemplateRef } from "@angular/core";

@Directive({
  selector: "[appEditMode]",
  standalone: true,
})
export class EditModeDirective {
  public template = inject(TemplateRef<any>);
}
