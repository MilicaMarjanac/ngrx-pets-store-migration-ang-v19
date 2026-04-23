import { Directive, inject, TemplateRef } from "@angular/core";

@Directive({
  selector: "[appViewMode]",
  standalone: true,
})
export class ViewModeDirective {
  public template = inject(TemplateRef<any>);
}
