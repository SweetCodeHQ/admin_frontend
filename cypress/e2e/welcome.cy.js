describe("welcome page", () => {
  beforeEach(() => {
    cy.visit("localhost:5173/");
  });
  it("has two logos", () => {
    cy.get('[data-cy="FLogo"]');
    cy.get('[data-cy="HLogo"]');
  });
  it("has a login button"), () => {};
  it("has footer links"), () => {};
});
