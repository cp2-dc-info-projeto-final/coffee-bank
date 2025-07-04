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
 - [CDU 12](#cdu-12): Criação de Automatização de Pagamentos
 - [CDU 13](#cdu-13): Supervisionamento do saldo
 - [CDU 14](#cdu-14): Realização de Emprestimos
 - [CDU 15](#cdu-15): Vizualização de Categoria da Unidade Monetária
 - [CDU 16](#cdu-16): Investimentos
 - [CDU 17](#cdu-17): Excluir Categoria de Unidade Monetária
 - [CDU 18](#cdu-18): Editar categoria de Unidade Monetária

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
1. O sistema fornece um formulário de criação de contas com 
      - CPF/RG
      - senha de 5 digitos
      - confirmação senha de 5 digitos
      - senha de 7 digitos
      - confirmação senha de 7 dígitos
      - data de nascimento 
      - nome
2. O usuário preencherá o formulário.
3. O usuário apertará em enviar e mandará a requisição.
4. O sistema o validará a senha
5. Os dados serão validados e salvos

#### Fluxo alternativo
##### CFA-1: Dados incorretos

###### FA-1: dados incompletos
   1. O sistema fornece um formulário de criação de contas com 
      - CPF/RG
      - senha de 5 digitos
      - confirmação senha de 5 digitos
      - senha de 7 digitos
      - confirmação senha de 7 dígitos
      - data de nascimento 
      - nome
   2. O usuário não coloca alguma informação
   3. O usuário apertará em enviar e mandará a requisição.
   4. O sistema o validará a senha
   5. O sistema falará que os dados estão incompletos e quais campos estão nulos
###### FA-2: Dados incorretos
   1. O sistema fornece um formulário de criação de contas com 
      - CPF/RG
      - senha de 5 digitos
      - confirmação senha de 5 digitos
      - senha de 7 digitos
      - confirmação senha de 7 dígitos
      - data de nascimento 
      - nome
   2. O usuário coloca alguma informação inválida.
   3. O usuário apertará em enviar e mandará a requisição.
   4. O sistema o validará a senha.
   5. O sistema falará que os dados estão inválidos e quais campos estão inválidos.
###### FA-3: Senhas diferentes
   1. O sistema fornece um formulário de criação de contas com 
      - CPF/RG
      - senha de 5 digitos
      - confirmação senha de 5 digitos
      - senha de 7 digitos
      - confirmação senha de 7 dígitos
      - data de nascimento 
      - nome
   2. O usuário preencherá o formulário com as senhas de 5 ou 7 dígitos diferentes nos campos de senha e confirmação.
   3. O usuário apertará em enviar e mandará a requisição.
   4. O sistema o validará a senha
   5. O sistema informará que as senhas estão diferentes
###### FA-4: CPF/RG já cadastrado
   1. O sistema fornece um formulário de criação de contas com 
      - CPF/RG
      - senha de 5 digitos
      - confirmação senha de 5 digitos
      - senha de 7 digitos
      - confirmação senha de 7 dígitos
      - data de nascimento 
      - nome
   2. O usuário preencherá o formulário um RG/CPF que já está cadastrado no sistema.
   3. O usuário apertará em enviar e mandará a requisição.
   4. O sistema o validará o CPF
   5. O sistema informará que o CPF já está cadastrado
##### CFA-2: Alteração de rota
###### FA-1: Cancelamento
   1. O sistema fornece um formulário de criação de contas com 
      - CPF/RG
      - senha de 5 digitos
      - confirmação senha de 5 digitos
      - senha de 7 digitos
      - confirmação senha de 7 dígitos
      - data de nascimento 
      - nome
   2. O sistema fornecerá um botão de cancelamento de cadastro
   3. O usuário clicará no botão
   4. O sistema o redirecionará a página de login/cadastro.
**Diagrama de sequência XX**

![Diagrama de Sequência](diagramas/diagrama-exemplo.png)


### CDU 02

Login

#### Atores
- User

#### Fluxo Principal
1. O sistema fornece formulário de login de contas com os campos:
   - senha de cinco digitos
   - numero da conta
2. O usuário preencherá os campos.
3. Os dados serão validados no sistema.
4. O usuário será redirecionado a página principal logado em sua conta.

#### Fluxo alternativo
##### CFA-1: Dados incorretos
###### FA-1: Senha diferente da cadastrada
1. O sistema fornece formulário de login de contas com os campos:
   - senha de cinco digitos
   - numero da conta
2. O usuário preencherá o campo de senha incorretamente.
3. Os dados serão validados no sistema.
4. O usuário será avisado que a senha está errada.
###### FA-2: Campo vazio
1. O sistema fornece formulário de login de contas com os campos:
   - senha de cinco digitos
   - numero da conta
2. O usuário não preencherá algum campo dos campos.
3. Os dados serão validados no sistema.
4. O usuário será avisado que o campo está nulo.
###### FA-3: Número de conta inexistente
1. O sistema fornece formulário de login de contas com os campos:
   - senha de cinco digitos
   - numero da conta
2. O usuário preencherá o campo de conta com um número de conta inexistente.
3. Os dados serão validados no sistema.
4. O usuário será avisado que o campo de conta está com um valor que não está cadastrado.

##### CFA-2: Alteração de rota
###### FA-1: Cancelamento
1. O sistema fornece formulário de login de contas com os campos:
   - senha de cinco digitos
   - numero da conta
2. O sistema fornecerá um campo de cancelar login.
3. O usuário apertará no botão
4. O usuário será mandado para a página de login/cadastro
### CDU 03

Transferências

#### Atores

- User

#### Fluxo Principal
1. O sistema fornecerá um botão com o simbolo de dinheiro localizado na tela princial de usuário.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário digitará o valor da transferência e chave pix a qual deseja transferir o dinheiro.
5. O sistema validará os dados e redicionará o usuário a outra página.
6. O sistema terá um botão para confirmar ou cancelar a operação embaixo da tela.
7. O usuário clicará no botão de confirmar.
8. O sistema pedirá a senha de 7 dígitos.
9. O usuário digitará a senha de sete dígitos.
10. O sistema validará os dados e fará a transferência.
11. O usuário é redirecionado a tela principal e recebe o pop up de operação sucedida.

#### Fluxo alternativo

##### CFA-1: Dados incorretos

###### FA-1: Senha diferente da cadastrada
1. O sistema fornecerá um botão com o simbolo de dinheiro localizado na tela princial de usuário.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário digitará o valor da transferência e chave pix a qual deseja transferir o dinheiro.
5. O sistema validará os dados e redicionará o usuário a outra página.
6. O sistema terá um botão para confirmar ou cancelar a operação embaixo da tela.
7. O usuário clicará no botão confirmar.
8. O sistema pedirá a senha de 7 dígitos.
9. O usuário digitará uma senha de sete digítos diferente da do usuário.
10. O sistema validará os dados e requisitará ao usuário colocar a senha correta.

###### FA-2: Campo pix vazio
1. O sistema fornecerá um botão com o simbolo de dinheiro localizado na tela princial de usuário.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário não colocará o pix a qual deseja transferir o dinheiro nos campos.
5. O sistema perceberá a ausência de dados requisitará que o usuário digite o pix de um usuário.

###### FA-3: Dinheiro insuficiente
1. O sistema fornecerá um botão com o simbolo de dinheiro localizado na tela princial de usuário.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário digitará o valor da transferência, que será acima do que ele tem atualmente na conta e chave pix a qual deseja transferir o dinheiro.
5. O sistema validará os dados e avisará ao usuário que a quantia monetária selecionada excede os recursos disponíveis na conta.

###### FA-4: Remetente inexistente
1. O sistema fornecerá um botão com o simbolo de dinheiro localizado na tela princial de usuário.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário colocará um pix inexistente e o valor monetário desejado.
5. O sistema validará os dados, e requisitará que o usuário digite o pix de um usuário existente.

##### CFA-2: Alteração de rota
###### FA-1: Cancelamento de operação
1. O sistema fornecerá um botão com o simbolo de dinheiro localizado na tela princial de usuário.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário digitará o valor da transferência e chave pix a qual deseja transferir o dinheiro.
5. O sistema validará os dados e redicionará o usuário a outra página.
6. O sistema terá um botão para confirmar ou cancelar a operação embaixo da tela.
7. O usuário clicará no botão cancelar.
8. O sistema encerrará a operação, redirecionando o usuário á página inicial.


### CDU 04

Vizualização de Extrato

#### Atores

- User

#### Fluxo Principal
1. O sistema fornecerá um botão para consulta do extrato
2. O usuário clicará no botão
3. O usuário será redirecionado para a página de saldo
4. O sistema buscará ás transferências realizadas e exibirá essas informações ao usuário.
#### fluxo alternativo
##### CFA-1: Alteração de exibição
###### FA-1: filtragem de transferências
   1. O sistema fornecerá um botão para consulta do extrato
   2. O usuário clicará no botão
   3. O usuário será redirecionado para a página de saldo
   4. O sistema buscará ás transferências realizadas e exibirá essas informações ao usuário.
   5. O sistema fornecerá o botão de filtragens de transferências
   6. O usuário clicará no botão
   7. O sistema abrirá o campo de filtragem
   8. O usuário filtrará quais transferências quer ou não visualizar pelos filtros de:
      - Remetente
      - Destinatário
      - Recorte temporal
      - Valor
      - Categoria monetária usada na transferência
      - Rebido ou enviado
   9. Os dados seram mostrados de acordo com o filtro do usuário
##### CFA-2: Alteração de rota
###### FA-1: cancelamento de vizaulização de extrato
   1. O sistema fornecerá um botão para consulta do extrato
   2. O usuário clicará no botão
   3. O usuário será redirecionado para a página de saldo
   4. O sistema buscará ás transferências realizadas e exibirá essas informações ao usuário.
   5. O sistema fornecerá o botão de voltar
   6. O usuário clicará no botão de voltar
   7. O sistema redirecionará o usuário para a pagina principal
###### FA-2:Cancelamento de filtragem de transferências
   1. O sistema fornecerá um botão para consulta do extrato
   2. O usuário clicará no botão
   3. O usuário será redirecionado para a página de saldo
   4. O sistema buscará ás transferências realizadas e exibirá essas informações ao usuário.
   5. O sistema fornecerá o botão de filtragens de transferências
   6. O usuário clicará no botão
   7. O sistema abrirá o campo de filtragem exibirá o campo de cancelar filtragem
   8. o sistema fechará o campo de filtragem

### CDU 05
Cadastro de investimentos

#### Atores
- User

#### Fluxo Principal
1. O sistema exibe um botão "Cadastrar Investimento" na página principal do usuário.
2. O usuário clica no botão.
3. O sistema redireciona o usuário para a página de login.
4. O sistema exibe campos para CPF do usuário e senha.
5. O usuário insere suas credenciais e clica em "Entrar".
6. O sistema valida o formato dos dados (ex.: CPF válido, senha não vazia)
   - Credenciais são verificas no banco de dados e confirmado se o login é válido.
7. O sistema redireciona o usuário para a página de cadastro de investimentos.
8. O sistema exibe um formulário com os campos:
   - CPF do dono do investimento
   - Valor de cada fundo imobiliário
   - Tamanho da propriedade
   - Tamanho a ser dividido entre os fundos
   - Número de fundos imobiliários para negociação
   - Percentual de aluguel para investidores
   - Nome da propriedade
   - Número da conta para transferência
   - Nome do fundo
   - Nome do proprietário
   - Distrito Federal da propriedade
20. O usuário preenche todos os campos com os dados do proprietário.
21. O usuário clica no botão "Confirmar Cadastro".
22. O sistema valida os dados (campos obrigatórios, valores numéricos válidos)
   - valida a consistência dos dados (ex.: CPF existente, valores positivos)
   - salva o investimento no banco de dados.
26. O sistema envia uma confirmação de cadastro bem-sucedido.
27. O sistema exibe a mensagem: "Investimento registrado com sucesso!" e redireciona o usuário para a página inicial.

### CDU 06
Cancelamento de Contas via Admin

#### Atores
- Admin

#### Fluxo Principal
1. O sistema oferecerá um botão de gerenciamento de usuário.
2. O admin clicará no botão de gerenciamento de usuário.
3. O sistema pedirá a confirmação via senha de admin de 12 dígitos.
4. O admin fornecerá a senha
5. O sistema validará a senha e redirecionará o admin à página de gerenciamento de usuário, além de exibir todas as contas do sistema com um botão de deletar ao lado.
6. O admin apertará no botão de excluir do usuário desejado.
7. O sistema requisitára a senha de 12 caractéres do admin.
8. O admin fornecerá a senha.
9. O sistema validará a senha e cancelará a conta do usuário, e exibirá uma mensagem de terminação concluída.

#### Fluxo Alternativo
##### CFA-1: Dados Errados

###### FA-1: Senha diferente da do admin
1. O sistema oferecerá um botão de gerenciamento de usuário.
2. O admin clicará no botão de gerenciamento de usuário.
3. O sistema pedirá a confirmação via senha de admin de 12 dígitos.
4. O admin fornecerá a senha errada
5. O sistema validará os dados e requisitará que o admin digite a senha de 12 digítos correta.

##### CFA-2: Alteração de Rota
###### FA-1: Cancelamento da Senha de Confirmação Final
1. O sistema oferecerá um botão de gerenciamento de usuário.
2. O admin clicará no botão de gerenciamento de usuário.
3. O sistema pedirá a confirmação via senha de admin de 12 dígitos.
4. O admin fornecerá a senha.
5. O sistema validará a senha e redirecionará o admin à página de gerenciamento de usuário, além de exibir todas as contas do sistema com um botão de deletar ao lado.
6. O admin apertará no botão de excluir do usuário desejado.
7. O sistema requisitára a senha de 12 caractéres do admin.
8. O admin abortará a operação ao clicar no botão de cancelar.
9. O sistema redirecionará o admin á página de gerenciamento de usuário.

###### FA-2: Cancelamento de Confirmaação de Login
1. O sistema mostrará as tabelas para preencher o Login.
2. O usuário estará colocando todas as informações pedidas nestas tabelas de preenchimento.
   - CPF Válido
   - Senha Válida
3. O sistema irá verificar se todas as informações estão corretas e mostrar uma tela de carregamento.
4. O sistema irá mostrar se está Válido ou Inválido.
5. Caso Inválido, estará impedindo o usuário de entrar, necessitando repetir as credenciais corretamente.
6. Caso Válido, o sistema estará mostrando um popup questinando se ele quer mesmo prosseguir, com opções de Confirmar e Cancelar.
7. Usuário clicará na opção de Cancelar.
8. Sitema estará redirecioanndo o usuário para o preenchimento das credenciais de Login e Cadastro.

###### FA-3: Cancelamento De Pagamento
1. Sistema irá mostrar os dados (com Nomes, CPF, Localização, Notas) contento as informações de onde o dinheiro será destinado
   - Pagamento de Taxas
   - Transferências
2. Usuário listará as informações e estará escolhendo os botões Confirmar e Cancelar que o sistema exibirá desde sua primeira interação em pagamentos.
3. Usuário irá clicar em Confirmar, sendo redirecionado para uma janela onde solicitará a Confirmação de Senha do próprio.
4. Usuário preencherá a Confirmação de Senha Válida.
5. Caso Inválido, sistema exigirá a repetição da Confirmação de Senha para uma Válida.
6. Caso Válido, sistema irá exibir um popout questionando se o usuário deseja realmente prosseguir sua transferência, havendo opções de Confirmação e Cancelar.
7. O usuário estará clicando em Cancelar.
8. Sistema redirecionará o usuário para a tela inicial.

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

#### Fluxos Alternativos

##### CFA-1: Alteração de Rotas
###### FA-1: Cancelamento Cadastro de Admin
1. O sistema providenciará um botão para cadastro de novos admins.
2. O admin clicará no botão para cadastrar outros admins.
3. O sistema exigirá a senha de 12 caracteres do admin.
4. O admin digitará a senha.
5. O sistema validará a senha e redirecionará o admin para a página de cadastro de admins, além de fornecer um botão de cancelamento
6. O usuário clicará no botão
7. O sistema redirecionará o usuário para a página principal de admins

###### FA-2: Cancelamento da Senha Para Acessar o Cancelamento
1. O sistema providenciará um botão para cadastro de novos admins.
2. O admin clicará no botão para cadastrar outros admins.
3. O sistema exigirá a senha de 12 caracteres do admin e fornecerá um botão de cancelar.
4. O usuário clicará no botão
5. O sistema redirecionará o usuário para a pagina principal de admins

##### CFA-2: Erro de dados
###### FA-1: Filtragem de Transferências

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
6. O admin clicará no botão de apagar o admin desejado.
7. O sistema requisitará a senha de 12 dígitos
8. O admin escreverá sua senha.
9. O sistema validará os dados e terminará a conta do admin, além de exibir ao admin que está efetuando a deleção uma mensagem de exclusão efetuada.

#### Fluxo alternativo
##### CFA-1: Dados errados

###### FA-1: Senha diferente da do admin 1
1. O sistema fornecerá um botão para apagar outros admin na pagina inical de admin.
2. O admin clicará no botão.
3. O sistema requisitará a senha de 12 dígitos.
4. O admin colocará a senha errada.
5. O sistema requisitará ao admin a senha correta.

###### FA-2: Senha diferente da do admin 2
1. O sistema fornecerá um botão para apagar outros admin na pagina inical de admin.
2. O admin clicará no botão.
3. O sistema requisitará a senha de 12 dígitos.
4. O admin escreverá a senha.
5. O sistema validará a senha e redicionará o admin para página de redirecionamento de admins, onde exibirá todos os admins com um botão de exclusão de conta ao lado.
6. O admin clicará no botão de apagar o admin desejado.
7. O sistema requisitará a senha de 12 dígitos
8. O admin colocará a senha errada.
9. O sistema requisitará ao admin a senha correta.

###### FA-3: Campo senha vazio 1
1. O sistema fornecerá um botão para apagar outros admin na pagina inical de admin.
2. O admin clicará no botão.
3. O sistema requisitará a senha de 12 dígitos.
4. O admin não inserirá nenhuma informação.
5. O sistema requisitará ao admin que coloque a senha.

###### FA-4: Campo senha vazio 2
1. O sistema fornecerá um botão para apagar outros admin na pagina inical de admin.
2. O admin clicará no botão.
3. O sistema requisitará a senha de 12 dígitos.
4. O admin escreverá a senha.
5. O sistema validará a senha e redicionará o admin para página de redirecionamento de admins, onde exibirá todos os admins com um botão de exclusão de conta ao lado.
6. O admin clicará no botão de apagar o admin desejado.
7. O sistema requisitará a senha de 12 dígitos
8. O admin não inserirá nenhuma informação.
9. O sistema requisitará ao admin que coloque a senha.

##### CFA-2: Alteração de rota
###### FA-1: Abortação de operação 1
1. O sistema fornecerá um botão para apagar outros admin na pagina inical de admin.
2. O admin clicará no botão.
3. O sistema requisitará a senha de 12 dígitos.
4. O admin clicará o botão cancelar.
5. O sistema redirecionará o admin para a página inicial.

###### FA-2: Abortação de operação 2
1. O sistema fornecerá um botão para apagar outros admin na pagina inical de admin.
2. O admin clicará no botão.
3. O sistema requisitará a senha de 12 dígitos.
4. O admin escreverá a senha.
5. O sistema validará a senha e redicionará o admin para página de redirecionamento de admins, onde exibirá todos os admins com um botão de exclusão de conta ao lado.
6. O admin clicará no botão de apagar o admin desejado.
7. O sistema requisitará a senha de 12 dígitos
8. O admin clicará o botão cancelar.
9. O sistema abortará a operação atual e redirecionará o admin para a página inicial.

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

### CDU 13
Supervisionamento do saldo

#### Atores
- User

#### Fluxo Principal
1. O sistema fornecerá um botão para vizualizar o supervisionamento do saldo.
2. O usuário clicará nesse botão.
3. O sistema requisitará a senha de 5 dígitos
4. O usuário digitará a senha
5. O sistema validará a senha e redicionará o usuário página de visualização de extrato, onde o sistema exibirá todas as transações feitas nos últimos 12 meses em um formato de gráfico.

### CDU 14
- Empréstimo

#### Atores
- User

#### Fluxo Principal  
1. O sistema fornecerá um botão para realização de empréstimos.
2. O usuário clicará no botão.
3. O sistema o redirecionará  a página de empréstimos, onde terá todos os empréstimos disponíveis.
4. O usuário escolherá um empréstimo.
5. O sistema exibirá um modal/ formulário com os seguintes campos:
  - Valor solicitado
  - Número de parcelas
6. O usuário  preencherá esses campos.
7. O sistema validará esses dados e calculará além de exibir essas informações com os dados inseridos pelo usuário, e um botão de confirmação:
   - Valor da parcela  
   - CET (Custo Efetivo Total)  
   - Data prevista de quitação 
8. O usuário apertará o botão.
9. O sistema validará esses dados e redirecionará o usuário para outro modal, onde terá os seguintes campos:
   - Um dropdown que determina o tipo de empréstimo.
   - Confirmação de renda.
   - Aceitação dos termos legais
10. O usuário preencherá esse modal.
11. O sistema validará os dados e verificará se o usuário pode realizar este empréstimo, e criará uma pré-aprovação imediata, exibindo ao usuário o contrato digital com assinatura eletrônica, além de requisitar a confirmação do usuário por meio da senha de 7 digítos.
12. O usuário digitará sua senha.
13. O sistema validará a senha, e disponibilizará o crédito na conta, mandando uma mensagem avisando essa disponibilidade de crédito ao email do usuário, além de exibir uma mensagem de operação bem sucedida ao usuário, redirecionando-o á página de emprésimos. 
#### Fluxos alternativos
   ##### CFA-1: Alteração de Rotas
      ###### FA-1: empréstimo recusado
         1. O sistema fornecerá um botão para realização de empréstimos.
         2. O usuário clicará no botão.
         3. O sistema o redirecionará  a página de empréstimos, onde terá todos os empréstimos disponíveis.
         4. O usuário escolherá um empréstimo.
         5. O sistema exibirá um modal/ formulário com os seguintes campos:
            - Valor solicitado
            - Número de parcelas
         6. O usuário  preencherá esses campos.
         7. O sistema validará esses dados e calculará mas recusará por um dos seguintes motivos:
            - Empréstimo em andamento.
            - Excesso de dívidas.
            - Saldo irrisóriamente pequeno para as condições.
            - O score do usuário é ruim.
         8. O sistema redireciona a pessoa para a página pricipal e avisa que a transição foi impedida
      ###### FA-2: Dados nulos
         1. O sistema fornecerá um botão para realização de empréstimos.
         2. O usuário clicará no botão.
         3. O sistema o redirecionará  a página de empréstimos, onde terá todos os empréstimos disponíveis.
         4. O usuário escolherá um empréstimo.
         5. O sistema exibirá um modal/ formulário com os seguintes campos:
            - Valor solicitado
            - Número de parcelas
         6. O usuário  preencherá esses campos, mas deixará algum deles vazio.
         7. O sistema validará e dirá que o usuario deixou dados nulos.
      ###### FA-3: Dados inválidos
         1. O sistema fornecerá um botão para realização de empréstimos.
         2. O usuário clicará no botão.
         3. O sistema o redirecionará  a página de empréstimos, onde terá todos os empréstimos disponíveis.
         4. O usuário escolherá um empréstimo.
         5. O sistema exibirá um modal/ formulário com os seguintes campos:
            - Valor solicitado
            - Número de parcelas
         6. O usuário  preencherá esses campos, mas deixará algum deles com dados inválidos.
         7. O sistema validará e dirá que o usuario deixou dados inválidos.
   ##### CFA-2: Erros de autenticação
      ###### FA-1: Senha nula
         1. O sistema fornecerá um botão para realização de empréstimos.
         2. O usuário clicará no botão.
         3. O sistema o redirecionará  a página de empréstimos, onde terá todos os empréstimos disponíveis.
         4. O usuário escolherá um empréstimo.
         5. O sistema exibirá um modal/ formulário com os seguintes campos:
         - Valor solicitado
         - Número de parcelas
         6. O usuário  preencherá esses campos.
         7. O sistema validará esses dados e calculará além de exibir essas informações com os dados inseridos pelo usuário, e um botão de confirmação:
            - Valor da parcela  
            - CET (Custo Efetivo Total)  
            - Data prevista de quitação 
         8. O usuário apertará o botão.
         9. O sistema validará esses dados e redirecionará o usuário para outro modal, onde terá os seguintes campos:
            - Um dropdown que determina o tipo de empréstimo.
            - Confirmação de renda.
            - Aceitação dos termos legais
         10. O usuário preencherá esse modal.
         11. O sistema validará os dados e verificará se o usuário pode realizar este empréstimo, e criará uma pré-aprovação imediata, exibindo ao usuário o contrato digital com assinatura eletrônica, além de requisitar a confirmação do usuário por meio da senha de 7 digítos.
         12. O usuário digitará não sua senha.
         13. O sistema validará a senha e retornará que a senha está nula
      ###### FA-2: Senha inválida
         1. O sistema fornecerá um botão para realização de empréstimos.
         2. O usuário clicará no botão.
         3. O sistema o redirecionará  a página de empréstimos, onde terá todos os empréstimos disponíveis.
         4. O usuário escolherá um empréstimo.
         5. O sistema exibirá um modal/ formulário com os seguintes campos:
         - Valor solicitado
         - Número de parcelas
         6. O usuário  preencherá esses campos.
         7. O sistema validará esses dados e calculará além de exibir essas informações com os dados inseridos pelo usuário, e um botão de confirmação:
            - Valor da parcela  
            - CET (Custo Efetivo Total)  
            - Data prevista de quitação 
         8. O usuário apertará o botão.
         9. O sistema validará esses dados e redirecionará o usuário para outro modal, onde terá os seguintes campos:
            - Um dropdown que determina o tipo de empréstimo.
            - Confirmação de renda.
            - Aceitação dos termos legais
         10. O usuário preencherá esse modal.
         11. O sistema validará os dados e verificará se o usuário pode realizar este empréstimo, e criará uma pré-aprovação imediata, exibindo ao usuário o contrato digital com assinatura eletrônica, além de requisitar a confirmação do usuário por meio da senha de 7 digítos.
         12. O usuário digitará uma senha que não seja de 7 dígitos.
         13. O sistema validará a senha e retornará que a senha é inválida.
      ###### FA-3: Senha errada
         1. O sistema fornecerá um botão para realização de empréstimos.
         2. O usuário clicará no botão.
         3. O sistema o redirecionará  a página de empréstimos, onde terá todos os empréstimos disponíveis.
         4. O usuário escolherá um empréstimo.
         5. O sistema exibirá um modal/ formulário com os seguintes campos:
         - Valor solicitado
         - Número de parcelas
         6. O usuário  preencherá esses campos.
         7. O sistema validará esses dados e calculará além de exibir essas informações com os dados inseridos pelo usuário, e um botão de confirmação:
            - Valor da parcela  
            - CET (Custo Efetivo Total)  
            - Data prevista de quitação 
         8. O usuário apertará o botão.
         9. O sistema validará esses dados e redirecionará o usuário para outro modal, onde terá os seguintes campos:
            - Um dropdown que determina o tipo de empréstimo.
            - Confirmação de renda.
            - Aceitação dos termos legais
         10. O usuário preencherá esse modal.
         11. O sistema validará os dados e verificará se o usuário pode realizar este empréstimo, e criará uma pré-aprovação imediata, exibindo ao usuário o contrato digital com assinatura eletrônica, além de requisitar a confirmação do usuário por meio da senha de 7 digítos.
         12. O usuário digitará uma senha que não seja a sua.
         13. O sistema validará a senha e retornará que a senha está errada.
   ##### CFA-3: Erros de alteração de rota
      ###### FA-1: Sair da página de impréstimo
         1. O sistema fornecerá um botão para realização de empréstimos.
         2. O usuário clicará no botão.
         3. O sistema o redirecionará  a página de empréstimos, onde terá todos os empréstimos disponíveis.
         4. O sistema fornecerá um botão de voltar para a página principal.
         5. O usuário apertará no botão
         6. O sistema redirecionará o usuário para a página principal
      ###### FA-2: Cancelar o impréstimo
         1. O sistema fornecerá um botão para realização de empréstimos.
         2. O usuário clicará no botão.
         3. O sistema o redirecionará  a página de empréstimos, onde terá todos os empréstimos disponíveis.
         4. O usuário escolherá um empréstimo.
         5. O sistema exibirá um modal/ formulário com os seguintes campos:
            - Valor solicitado
            - Número de parcelas
         6. O sistema fornecerá um botão de cancelar impréstimo
         7. O usuário clicará no botão
         8. O form de investimento será cancelado
      ###### FA-3: Cancelamento de senha
         1. O sistema fornecerá um botão para realização de empréstimos.
         2. O usuário clicará no botão.
         3. O sistema o redirecionará  a página de empréstimos, onde terá todos os empréstimos disponíveis.
         4. O usuário escolherá um empréstimo.
         5. O sistema exibirá um modal/ formulário com os seguintes campos:
         - Valor solicitado
         - Número de parcelas
         6. O usuário  preencherá esses campos.
         7. O sistema validará esses dados e calculará além de exibir essas informações com os dados inseridos pelo usuário, e um botão de confirmação:
            - Valor da parcela  
            - CET (Custo Efetivo Total)  
            - Data prevista de quitação 
         8. O usuário apertará o botão.
         9. O sistema validará esses dados e redirecionará o usuário para outro modal, onde terá os seguintes campos:
            - Um dropdown que determina o tipo de empréstimo.
            - Confirmação de renda.
            - Aceitação dos termos legais
         10. O usuário preencherá esse modal.
         11. O sistema validará os dados e verificará se o usuário pode realizar este empréstimo, e criará uma pré-aprovação imediata, exibindo ao usuário o contrato digital com assinatura eletrônica, além de requisitar a confirmação do usuário por meio da senha de 7 digítos.
         12. O sistema fornecerá um botão de cancelar confirmação.
         13. A altenticação será fechado
### CDU 17
Vizualização de Categoria da unidade monetária

#### Atores
- User

#### Fluxo Principal
1. O sistema irá fornecer um botão de categorização da unidade monetária
2. O usuário irá clicar nesse botão
3. O sistema requisitará a senha de 5 dígitos
4. O usuário digitará a senha
5. O sistema validará a senha
   - Enviará a senha para o checagem e mostrar tela de espera
   - Validará a senha 
   - enviará que a senha está correta
6. O sistema redirecionará o usuário para a página de categorização monetária
7. O sistema requisitará as categorias que aquele usuário criou
8. O sistema enviará todas as categorias cadastradas no banco de dados.
9. O sistema exibirá esses dados em formato de gráfico de pizza.

#### Fluxos Alternativos

## CFA-1
Erro de Autenticação

# FA-1
   Senha Incorreta
1. O sistema exibe a mensagem: "Senha incorreta. Tente novamente."
2. O usuário pode reinserir a senha (retornando ao passo 3) ou cancelar a ação.

# CFA-2
Ausência de Categoria

# FA-1
   Nenhuma Categoria Cadastrada
1. O sistema exibe a mensagem: "Nenhuma categoria encontrada."
2. O usuário pode retornar à página anterior ou sair.

## CFA-3
Acesso cancelado pelo usuário

# FA-1
   Quaisquer Cancelamento Pelo Usuário
1. O sistema retorna à tela inicial quando botão "cancelar" é pressionado.

### CDU-16
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

### CDU 17
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

### CDU 18
   Editar Categoria de Unidade Monetária

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