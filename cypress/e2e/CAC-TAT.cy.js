// Suíte de testes
describe('Central de Atendimento ao Cliente TAT', () => {
    // beforeEach garante que em todos os meus casos de teste, a página visitada será meu index.html
    beforeEach(() => {
        cy.visit('./src/index.html')
    })

    // it = Caso de teste
    it('verifica o título da aplicação', () => {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', () => {
        const longText = Cypress._.repeat(
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
            10
        )
        // Ações
        cy.get('#firstName').type('Letícia')
        cy.get('#lastName').type('Escobar Araujo')
        cy.get('#email').type('leticiaescobaraujo@gmail.com')
        cy.get('#open-text-area').type(longText, { delay: 0 })
        cy.contains('button', 'Enviar').click()

        //Verificação
        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
        // Ações
        cy.get('#firstName').type('Letícia')
        cy.get('#lastName').type('Escobar Araujo')
        cy.get('#email').type('leticiaescobaraujo@gmail/com')
        cy.get('#open-text-area').type('abcd')
        cy.contains('button', 'Enviar').click()

        // Verificação
        cy.get('.error').should('be.visible')
    })

    it('campo telefone continua vazio quando preenchido com valor não-numérico', () => {
        cy.get('#phone').type('abcde').should('have.value', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
        // Ações
        cy.get('#firstName').type('Letícia')
        cy.get('#lastName').type('Escobar Araujo')
        cy.get('#email').type('leticiaescobaraujo@gmail.com')
        cy.get('#open-text-area').type('Teste')
        //usando o check no lugar do click, evirtando que o click desmarque no lugar de marcar:
        // cy.get('#phone-checkbox').click()
        cy.get('#phone-checkbox').check()
        cy.contains('button', 'Enviar').click()

        // Verificação
        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        // Ações
        cy.get('#firstName')
            .type('Letícia')
            .should('have.value', 'Letícia')
            .clear()
            .should('have.value', '')
        cy.get('#lastName')
            .type('Escobar Araujo')
            .should('have.value', 'Escobar Araujo')
            .clear()
            .should('have.value', '')
        cy.get('#email')
            .type('leticiaescobaraujo@gmail.com')
            .should('have.value', 'leticiaescobaraujo@gmail.com')
            .clear()
            .should('have.value', '')
        cy.get('#phone')
            .type('67991839091')
            .should('have.value', '67991839091')
            .clear()
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.get('button[type="submit"').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', () => {
        const data = {
            firstName: 'Letícia',
            lastName: 'Escobar',
            email: 'leticiaescobaraujo@gmail.com',
            text: 'Teste'
        }
        cy.fillMandatoryFieldsAndSubmit(data)

        cy.get('.success').should('be.visible')
    })

    // Testes em inputs do tipo select
    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1).should('have.value', 'blog')
    })

    // Testes em inputs do tipo radio button
    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]')
            .check()
            .should('be.checked')
    })

    it('marca cada tipo de atendimento', () => {
        // O each recebe como argumento, uma função
        // Essa função recebe como argumento cada um dos elementos do array
        cy.get('input[type="radio"]').each(typeOfService => {
            // O wrap "empacota" os encadeamentos, no exemplo o check e o should
            cy.wrap(typeOfService).check().should('be.checked')
        })
    })

    // Testes em inputs do tipo radio checkbox
    it('marca ambos checkboxes, depois desmarca o último', () => {
        cy.get('input[type="checkbox"]')
            .check()
            .should('be.checked')
            .last()
            .uncheck()
            .should('not.be.checked')
    })

    // Fazendo upload de arquivos
    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('#file-upload')
            .selectFile('cypress/fixtures/example.json')
            .should(input => {
                expect(input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop', () => {
        cy.get('#file-upload')
            .selectFile('cypress/fixtures/example.json', {
                action: 'drag-drop'
            })
            .should(input => {
                expect(input[0].files[0].name).to.equal('example.json')
            })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        // usando o comando cy.fixture ele já busca dentro da pasta fixtures
        // O alias basicamente dá um apelido
        cy.fixture('example.json').as('sampleFile')
        cy.get('#file-upload')
            .selectFile('@sampleFile')
            .should(input => {
                expect(input[0].files[0].name).to.equal('example.json')
            })
    })

    // Lidando com links que abrem em uma outra aba
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.contains('a', 'Política de Privacidade')
            .should('have.attr', 'href', 'privacy.html')
            .and('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.contains('a', 'Política de Privacidade')
            .invoke('removeAttr', 'target')
            .click()

        cy.contains('h1', 'CAC TAT - Política de Privacidade').should(
            'be.visible'
        )
    })
})
