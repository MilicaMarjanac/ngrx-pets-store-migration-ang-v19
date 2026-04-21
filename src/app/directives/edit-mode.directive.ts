import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "[appEditMode]",
    standalone: true
})
export class EditModeDirective {
  constructor(public template: TemplateRef<any>) {}
}
