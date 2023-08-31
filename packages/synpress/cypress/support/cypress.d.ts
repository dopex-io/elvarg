import { mount } from 'cypress/react';

declare namespace Cypress {
  interface Chainable {
    mount: typeof mount;
  }
}
