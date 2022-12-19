it('login', () => {
  cy.visit('http://localhost:5000/');
  cy.get('.sign-up-btn-home').click();
  cy.get('#login-username').type('newuser2');
  cy.get('#login-password').type('newuser2');
  cy.get('.ant-modal-wrap').click();
  cy.get('.log-in-submit-btn').click();
  cy.get('#login-modal-form').submit();
  cy.wait(200);
  cy.get('.home-posts').should('be.visible');
});
