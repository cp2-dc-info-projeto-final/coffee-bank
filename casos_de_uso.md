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
 - [CDU 21](#cdu-21): Excluir categoria de unidade monetária
 - [CDU 22](#cdu-22): Editar categoria de unidade monetária

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
4. Os dados serão validados e salvos

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

### CDU 10

alterar senha

### Atores

- User

#### Fluxo Principal

### CDU 11

Buscar e consultar usuários

#### Atores

- Admin

#### Fluxo Principal

### CDU 12
- Notificação Via Usuário

#### Atores
- User/Sistema

#### Fluxo Principal 

### CDU 13

Desconto automático de imposto

#### Atores

- User

#### Fluxo Principal

### CDU 14

criação de automatização de pagamentos

#### Atores

- User

#### Fluxo Principal

### CDU 15

Supervisionamento do saldo

#### Atores

- User

#### Fluxo Principal

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

### CDU-18

Investimentos em cafezais

#### Atores
- User

#### Fluxo Principal

### CDU 21
   Excluir categoria de unidade monetária

#### Atores
   - User

#### Fluxo Principal

### CDU 22
   editar categoria de unidade monetária

#### Atores
   - User

#### Fluxo Principal
