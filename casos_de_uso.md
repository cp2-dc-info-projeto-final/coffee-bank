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
8. O sistema validará os dados
### CDU 04

Vizualização de Extrato

#### Atores

- User

#### Fluxo Principal

### CDU 05

Cadastro de investimentos

#### Atores

- Admin

#### Fluxo Principal

### CDU 06

cancelamento de contas

#### Atores

- Admin

#### Fluxo Principal

### CDU 07

cadastramento de admins

#### Atores

- Admin

#### Fluxo Principal

### CDU 08

excluir admin

#### Atores

- Admin

#### Fluxo Principal

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
