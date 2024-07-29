// Karma.conf.js vaatii tämän tiedoston ja lataa rekursiivisesti kaikki .spec- ja framework-tiedostot

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

// Alusta ensin Angular-testausympäristö.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Sitten löydämme kaikki testit.
const context = require.context('./', true, /\.spec\.ts$/);
// Ja lataa moduulit.
context.keys().map(context);
