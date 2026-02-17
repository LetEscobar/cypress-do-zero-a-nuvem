Cypress.Commands.add(
    'fillMandatoryFieldsAndSubmit',
    (
        // Valores padrão - são usados quando o usuário não passa os dados
        data = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johnDoe@example.com',
            text: 'Test John'
        }
    ) => {
        // Os valores padrão são ignorados caso o usuário passe os dados
        cy.get('#firstName').type(data.firstName)
        cy.get('#lastName').type(data.lastName)
        cy.get('#email').type(data.email)
        cy.get('#open-text-area').type(data.text)
        // cy.get('button[type="submit"]').click() //pode ser substituído pela opção abaixo:
        cy.contains('button', 'Enviar').click()
    }
)
