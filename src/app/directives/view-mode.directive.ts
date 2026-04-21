import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "[appViewMode]",
    standalone: false
})
export class ViewModeDirective {
  constructor(public template: TemplateRef<any>) {}
}
