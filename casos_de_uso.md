# Documento de Casos de Uso

## Lista dos Casos de Uso

 - [CDU 01](#CDU-01): Criação de contas.
 - [CDU 02](#CDU-02): Login
 - [CDU 03](#CDU-03): Transferências
 - [CDU 04](#CDU-04): Vizualização de Extrato
 - [CDU 05](#CDU-05): Cadastro de investimentos
 - [CDU 06](#CDU-06): Cancelamento de contas
 - [CDU 07](#CDU-07): Cadastramento de admins
 - [CDU 08](#CDU-08): Exclusão de admins
 - [CDU 09](#CDU-09): Editar Administradores
 - [CDU 10](#cdu-10): Alterar Senha
 - [CDU 11](#cdu-11): Buscar e Consultar Usuários
 - [CDU 12](#cdu-12): Notificação Via Usuário
 - [CDU 13](#cdu-13): Desconto Automático de Imposto
 - [CDU 14](#cdu-14): criação de automatização de pagamentos
 - [CDU 15](#cdu-15): Supervisionamento do saldo
 - [CDU 16](#cdu-16): Realização de emprestimos
 - [CDU 17](#cdu-17): Vizualização de Categoria da unidade monetária
 - [CDU 18](#cdu-18): Investimentos
 - [CDU 19](#cdu-19): Excluir categoria de unidade monetária
 - [CDU 20](#cdu-20): Editar categoria de unidade monetária

## Lista dos Atores

 - User
 - Admin

## Diagrama de Casos de Uso

![Diagrama de Casos de Uso](diagramas/diagrama-exemplo.png)

## Descrição dos Casos de Uso

### CDU 01

Criação de contas.

#### Atores
 - User
#### Fluxo Principal
1. O sistema fornece um formulário de criação de contas.
2. O usuário precisará fornecer o seu CPF/RG, uma senha de 5 digitos e sua confimação, uma senha de 7 digitos e sua confimação, sua data de nascimento e o seu nome.
3. O usuário apertará em enviar e mandará a requisição.
4. O sistema o validará a senha
5. Os dados serão validados e salvos

#### fluxo alternativo
### Dados incorretos

1. dados incompletos
   1. O sistema fornece um formulário de criação de contas.
   2. O usuário não coloca alguma informação
   3. O usuário apertará em enviar e mandará a requisição.
   4. O sistema o validará a senha
   5. O sistema falará que os dados estão incompletos e quais campos estão nulos
2. dados incorretos
   1. O sistema fornece um formulário de criação de contas.
   2. O usuário coloca alguma informação
   3. O usuário apertará em enviar e mandará a requisição.
   4. O sistema o validará a senha
   5. O sistema falará que os dados estão incompletos e quais campos estão nulos
**Diagrama de sequência XX**

![Diagrama de Sequência](diagramas/diagrama-exemplo.png)


### CDU 02

Login

#### Atores
- User

#### Fluxo Principal
1. O sistema fornece formulário de criação de contas
2. O usuário precisará fornecer o seu CPF/RG, uma senha de 5 digitos e sua confimação, uma 
senha de 7 digitos e sua confimação, sua data de nascimento e o seu nome.
3. O usuário apertará em enviar e mandará a requisição.
4. Os dados serão validados e será criado a conta do usuário.
 
### CDU 03

Transferências

#### Atores

- User

#### Fluxo Principal
1. O sistema fornecerá um botão com o simbolo de dinheiro localizado na tela princial de usuário.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário digitará o valor da transferência e chave pix a qual deseja trasnferir o dinheiro.
5. O sistema validará os dados e redicionará o usuário a outra página.
6. O sistema terá o botão verde com o texto confirmar embaixo da tela.
7. O usuário digitará a senha de sete dígitos.
8. O sistema validará os dados e fará a transferência.
9. O usuário é redirecionado a tela principal e recebe o pop up de operação sucedida.

### CDU 04

Vizualização de Extrato

#### Atores

- User

#### Fluxo Principal
1. O sistema fornecerá um botão para consulta do extrato
2. O usuário clicará no botão
3. O usuário será redirecionado para a página de saldo
4. O sistema buscará ás transferências realizadas e exibirá essas informações ao usuário.

### CDU 05

Cadastro de investimentos

#### Atores

- Admin

#### Fluxo Principal
1. O usuário irá até a agência conversar com o gerente.
2. O sitema providenciará um botão com o redirecionamento para a pagina de cadastro de investimentos localizada na pagina principal de usuários admin.
3. O Admin(gerente) clicará no botão para ir para o formulário.
4. O admin será redirecionado a página de login.
5. O sistema fornerá um login com as informações de
    - CPF do dono do investimento.
    - O valor de cada fundo imobiliário.
    - O tamanho da propiedade.
    - O tamanho a ser dividido entre os fundos.
    - O numero de fundos imobiliários a serem negociados na bolsa.
    - O aluguel em percentual que será pago aos investidores.
    - O nome da propiedade.
    - O numero da conta para a qual o valor será transferido.
    - O nome do fundo.
    - Nome do propietário
    - O distrito federal que se localiza a fazenda
6. O admin preencherá o formulário com os dados do propietário.
7. O sistema fornecerá um botão de confirmar ao fim do formulário.
8. O usuário apertará esse botão de confirmar
9. O sistema validará os dados, registrará o investimento e exibirá uma mensagem de sucesso

### CDU 06

Cancelamento de Contas

#### Atores

- Admin

#### Fluxo Principal
1. O sistema oferecerá um botão de gerenciamento de usuário.
2. O admin clicará no botão de gerenciamento de usuário.
3. O sitema pedirá a confirmação via senha de admin de 12 dígitos.
4. O admin fornecerá a senha
5. O sistema validará a senha e redirecionará o admin à página de gerenciamento de usuário, além de exibir todas as contas do sistema com um botão de deletar ao lado.
6. O admin apertará no botão de excluir.
7. O sistema requisitára a senha de 12 caractéres do usuário.
8. O admin fornecerá a senha.
9. O sistema validará a senha e cancelará a conta do usuário, e exibirá uma mensagem de terminação concluída.

### CDU 07

Cadastramento de Admins

#### Atores

- Admin

#### Fluxo Principal
1. O sistema providenciará um botão para cadastro de novos admins.
2. O admin clicará no botão para cadastrar outros admins.
3. O sistema exigirá a senha de 12 caracteres do admin.
4. O admin digitará a senha.
5. O sistema validará a senha e redirecionará o admin para a página de cadastro de admins, além de fornecer um formulário com os campos:
    - nome do novo admin
    - numero da conta do novo admin
    - cpf do novo admin
6. O admin completará os campos do formulário com as informações do novo admin que será cadastrado.
7. O sistema fornecerá um botão de confirmar cadastro.
8. O admin clicará no botão de confirmar cadastro.
9. O sistema pedirá a senha de 12 dígitos.
10. O admin digitará a senha de 12 dígitos.
11. O sistema validará a senha e gerará uma senha de 12 digítos aleatória para o novo admin, além de exibi-lá ao admin.

### CDU 08

Excluir Admin

#### Atores

- Admin

#### Fluxo Principal
1. O sistema fornecerá um botão para apagar outros admin na pagina inical de admin.
2. O admin clicará no botão.
3. O sistema requisitará a senha de 12 dígitos.
4. O admin escreverá a senha.
5. O sistema validará a senha e redicionará o admin para página de redirecionamento de admins, onde exibirá todos os admins com um botão de exclusão de conta ao lado.
6. O admin clicará no botão de apagar admin.
7. O sistema requisitará a senha de 12 dígitos
8. O admin escreverá sua senha.
9. O sistema validará os dados e terminará a conta do admin, além de exibir ao admin que está efetuando a deleção uma mensagem de exclusão efetuada.

### CDU 09 
- Editar Administradores

### Atores
- Admin

#### Fluxo Principal

1. O sistem fornecerá, na página de gerenciamento um botão "Editar" ao lado de cada admin listado.  
2. Ao clicar, o sistema exigirá a senha de 12 digítos do administrador. 
3. O Admin colocará sua senha.
4. O sistema irá validar a senha do administrador, e  imediatamente exibirá um modal/formulário com campos para nome e conta.
5. O Admin preencherá o formulário com ás mudanças desejadas.
6. O sistema validará ás alterações, e aplica ás edições feitas, relatando ao administrador que as mudanças foram realizadas com sucesso.

### CDU 10

Alterar senha

### Atores

- User

#### Fluxo Principal
1. O sistema fornecerá o botão de alterar senha
2. O usuário apertará no botão de alterar senha
3. O sistema redirecionará o usuário para a página de alteração de senha.
4. O sistema exibirá um formulário com 3 campos:
    - id da conta
    - senha nova
    - confirmação da nova senha
5. O sistema validará os dados e enviará uma mensagem ao e-mail do usuário contendo um código de 6 caracteres, além de exibir um campo para o usuário inserir o código.
6. O usuário digitará o código.
7. O sistema validará o código, e mudará a senha da conta do usuário pela nova senha, além de exibir ao usuário uma mensagem de alteração realizada com sucesso, redirecionando usuário á página de login.

### CDU 11

Buscar e consultar usuários

#### Atores

- Admin

#### Fluxo Principal
1. O sistema fornecerá um botão de gerenciamento de usuário
2. O Admin clicará no botão de gerenciamento
3. O sistema requisitará a senha de 12 caracteres
4. O Admin digitará a senha
5. O sistema validará a senha e redicionará o admin á página de gerenciamento de usuários, onde será exibido todos os usuários do sistema, além de um campo para pesquisa de usuários.
6. O admin digitará o nome do usuário que ele deseja achar.
7. O sistema validará os dados e exibirá ás informações desse usuário.

### CDU 12
- Notificação Via Usuário

#### Atores
- User/Sistema

#### Fluxo Principal 

### CDU 13

Desconto automático de imposto

#### Atores

- Sistema

#### Fluxo Principal
1. O sistema, na hora de porcessar o pagamento do user descontará uma taxa de 11% de taxa
2. O sistema computará o pagamento

### CDU 14

Criação de automatização de pagamentos

#### Atores

- User

#### Fluxo Principal
1. O sistema fornecerá um botão para automatização de pagamentos
2. O usuário clicará no botão
3. O sistema requisitará a senha de 5 dígitos
4. O usuário digitará a sua senha de 5 dígitos
5. O sistema validará a senha e redirecionará o usuário para a página de automatização de pagamentos, onde exibirá:
   -Todas as automaizações feitas previamente.
   -Um botão para cadastrar novos pagamentos automáticos.
6. O usuário clicará no botão.
7. O sistema fornecerá um formulário com os campos:
    - destinatário
    - valor
    - dia do mês
8. O usuário completará o formulário.
9. O sistema validará os dados e requiistará a senha de 7 digítos do usuário.
10. O usuário digitará a senha.
11. O sistema validará a senha e cadastrará o pagamento automático, além disso exibirá uma mensagem de operação feita com sucesso, e realizará todos os pagamentos nos dias previstos.

### CDU 15
Supervisionamento do saldo

#### Atores

- User

#### Fluxo Principal
1. O sistema fornecerá um botão para vizualizar o supervisionamento do saldo.
2. O usuário clicará nesse botão.
3. O sistema requisitará a senha de 5 dígitos
4. O usuário digitará a senha
5. O sistema validará a senha e redicionará o usuário página de visualização de extrato, onde o sistema exibirá todas as transações feitas nos últimos 12 meses em um formato de gráfico.

### CDU 16
- Empréstimo

#### Atores
- User

#### Fluxo Principal  

### CDU 17
Vizualização de Categoria da unidade monetária

#### Atores
- User

#### Fluxo Principal
1. O sistema exibe um botão de Categorização da Unidade Monetária na interface.
2. O usuário clica no botão de Categorização da Unidade Monetária.
3. O sistema solicita a senha de 5 dígitos para autenticação.
4. O usuário digita a senha.
5.  O sistema valida a senha.
6. O sistema redireciona o usuário para a página de categorização monetária com o botão de Gerenciar Categorias.
7. O usuário clica no botão de Gerenciar Categorias.
8. O sistema redireciona o usuário para a página de gerenciamento de categorias.
9. O sistema lista todas as categorias cadastradas, exibindo detalhes como nome, descrição, e data de criação.

### CDU-18

Investimentos em cafezais

#### Atores
- User

#### Fluxo Principal
1. O sistema fornecerá um botão de investimentos na página principal.
2. O usuário apertará no botão.
3. O sistema ajeitará essas informações na página de investimentos. 
4. O usuário será redirecionado a página de investimentos com todos os investimentos possíveis dele realizar.
5. O usuário selecionará um investimento.
6. O usuário será redirecionado a página do investimento selecionado onde haverá:
    - O valor de cada fundo imobiliário.
    - O tamanho da propriedade.
    - O tamanho a ser dividido entre os fundos.
    - O aluguel em percentual que será pago aos investidores.
    - O nome da propiedade.
    - O numero da conta para a qual o valor será transferido.
    - O nome do fundo.
    - Nome do propietário
    - O distrito federal que se localiza a fazenda
    - Um botão de investir.
7. O usuário apertará no botão.
8. O sistema fornecerá um campo onde será requisitado a senha de 7 digítos do usuário
9. O usuário fornecerá a senha

### CDU 19
   Excluir categoria de unidade monetária

#### Atores
   - User

#### Fluxo Principal
   1. O sistema irá fornecer um botão de categorização da unidade monetária.
   2. O usuário irá clicar nesse botão.
   3. O sistema requisitará a senha de 5 dígitos.
   4. O usuário digitará  a senha.
   5. O sistema validará a senha.
   6. O sistema redirecionará o usuário para a página de categorização monetária.
   7. O sistema fornecerá um botão de gerenciar categorias.
   8. O usuário clicará nesse botão.
   9. O usuário será redirecionado para a página de gerenciamento de categorias.
   10. O sistema exibirá as categorias em lista com um botão de excluir.
   11. O usuário clicará no botão de excluir.
   12. O sistema excluirá aquela automatização.
   13. O sistema exibirá os dados cadastrados.

### CDU 20
   editar categoria de unidade monetária

#### Atores
   - User

#### Fluxo Principal
   1. O sistema irá fornecer um botão de categorização da unidade monetária.
   2. O usuário irá clicar nesse botão.
   3. O sistema requisitará a senha de 5 dígitos.
   4. O usuário digitará  a senha.
   5. O sistema validará a senha.
   6. O sistema redirecionará o usuário para a página de categorização monetária.
   7. O sistema fornecerá um botão de gerenciar categorias.
   8. O usuário clicará nesse botão.
   9. O usuário será redirecionado para a página de gerenciamento de categorias.
   10. O sistema exibirá as categorias em lista com um botão de editar.
   11. O usuário clicará no botão de editar.
   12. O sistema fornecerá um formulário com os valores:
      - Nome da categoria.
      - porcentual que ela representa.
   13. O usuário preencherá o formulário.
   14. O Sistema fornecerá o botão de confimar.
   15. O usuário clicará no botão.
   16. O sistema fará as alterações
   17. O sistema voltará a lista de categorias.