import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: "[appEditMode]",
    standalone: false
})
export class EditModeDirective {
  constructor(public template: TemplateRef<any>) {}
}
