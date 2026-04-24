# Pets App

Functionalities available: load, add and edit pet. Edit mode is activate by clicking on pet name or type. NgRx state management, reactive forms and json-server used.

This project has been migrated from Angular 14 to Angular 19 with a focus on adopting modern standalone and functional patterns.

Key updates include:

- Transition from NgModule-based architecture to standalone components, directives, and configuration (ApplicationConfig)
- Adoption of the new dependency injection style using inject() across services, components, directives, and NgRx effects
- Integration of provideHttpClient and functional provider APIs instead of module-based imports
- Refactoring NgRx setup to align with newer patterns, including effects using inject() and improved state handling practices
- Introduction of Angular Signals to replace parts of RxJS-based state handling, improving local reactivity and reducing reliance on manual subscriptions
- Improved consistency in reactive forms and overall code structure

## Development server

Run `ng serve` for a frontend dev server and for backend server navigate to `/json-server` and run `npm run start`. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Demo

...to be deployed soon..
