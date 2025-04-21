describe('登录页面 E2E 测试', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('应显示用户名和密码输入框及登录按钮', () => {
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').contains('Login');
  });
});
