# Documento de Casos de Uso

## Lista dos Casos de Uso

 - [CDU 01](#CDU-01): Criação de contas.
 - [CDU 02](#CDU-02): Login
 - [CDU 03](#CDU-03): Transferências
 - [CDU 04](#CDU-04): Cadastro de investimentos
 - [CDU 07](#CDU-05): Cadastramento de admins
 - [CDU 08](#CDU-06): Exclusão de admins
 - [CDU 09](#CDU-07): Editar Administradores
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
      - nome
      - imagem de perfil
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
      - nome
   2. O usuário não coloca alguma informação
   3. O usuário apertará em enviar e mandará a requisição.
   4. O sistema validará os dados
   5. O sistema falará que os dados estão incompletos e quais campos estão nulos
###### FA-2: Dados incorretos
   1. O sistema fornece um formulário de criação de contas com 
      - CPF/RG
      - senha de 5 digitos
      - confirmação senha de 5 digitos
      - senha de 7 digitos
      - confirmação senha de 7 dígitos
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
      - nome
   2. O usuário preencherá o formulário com um RG/CPF que já está cadastrado no sistema.
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
   2. O sistema fornecerá uma nav de navegação.
   3. O usuário clicará no botão
   4. O sistema o redirecionará a página de login/cadastro.

### CDU 02

Login

#### Atores
- User

#### Fluxo Principal
1. O sistema fornece formulário de login de contas com os campos:
   - senha de cinco digitos
   - CPF
2. O usuário preencherá os campos.
3. Os dados serão validados no sistema.
4. O usuário será redirecionado a página principal logado em sua conta.

#### Fluxo alternativo
##### CFA-1: Dados incorretos
###### FA-1: Senha diferente da cadastrada
1. O sistema fornece formulário de login de contas com os campos:
   - senha de cinco digitos
   - numero do CPF
2. O usuário preencherá o campo de senha incorretamente.
3. Os dados serão validados no sistema.
4. O usuário será avisado que a senha está errada.
###### FA-2: Campo vazio
1. O sistema fornece formulário de login de contas com os campos:
   - senha de cinco digitos
   - numero do CPF
2. O usuário não preencherá algum campo dos campos.
3. Os dados serão validados no sistema.
4. O usuário será avisado que o campo está nulo.
###### FA-3: CPF não cadastrado
1. O sistema fornece formulário de login de contas com os campos:
   - senha de cinco digitos
   - numero da conta
2. O usuário preencherá o campo de conta com um número de conta inexistente.
3. Os dados serão validados no sistema.
4. O usuário será avisado que o campo de CPF está com um valor que não está cadastrado.

##### CFA-2: Alteração de rota
###### FA-1: Cancelamento
1. O sistema fornece formulário de login de contas com os campos:
   - senha de cinco digitos
   - numero do CPF
2. O sistema fornecerá uma nav de navegação.
3. O usuário apertará no botão
4. O usuário será mandado para a página correspondente ao botão da nav
### CDU 03

Transferências

#### Atores

- User

#### Fluxo Principal
1. O sistema fornecerá um botão Transferência.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário digitará o valor da transferência e chave pix a qual deseja transferir o dinheiro.
5. O sistema validará os dados e abrirá um modal de confirmação.
6. O sistema terá um botão para confirmar ou cancelar a operação embaixo da tela.
7. O usuário clicará no botão de confirmar.
8. O sistema pedirá a senha de 7 dígitos.
9. O usuário digitará a senha de sete dígitos.
10. O sistema validará os dados e fará a transferência.
11. O usuário é redirecionado a tela principal.

#### Fluxo alternativo

##### CFA-1: Dados incorretos

###### FA-1: Senha diferente da cadastrada
1. O sistema fornecerá um botão Transferência.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário digitará o valor da transferência e chave pix a qual deseja transferir o dinheiro.
5. O sistema validará os dados e abrirá um modal de confirmação.
6. O sistema terá um botão para confirmar ou cancelar a operação embaixo da tela.
7. O usuário clicará no botão confirmar.
8. O sistema pedirá a senha de 7 dígitos.
9. O usuário digitará uma senha de sete digítos diferente da do usuário.
10. O sistema validará os dados e requisitará ao usuário colocar a senha correta.

###### FA-2: Campo pix vazio
1. O sistema fornecerá um botão Transferência.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário não colocará o pix a qual deseja transferir o dinheiro nos campos.
5. O sistema perceberá a ausência de dados requisitará que o usuário digite o pix de um usuário.


##### CFA-2: Alteração de rota
###### FA-1: Cancelamento de operação
1. O sistema fornecerá um botão Transferência.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário digitará o valor da transferência e chave pix a qual deseja transferir o dinheiro.
5. O sistema validará os dados e abrirá um modal de confirmação.
6. O sistema terá um botão para confirmar ou cancelar a operação embaixo da tela.
7. O usuário clicará no botão cancelar.
8. O sistema encerrará a operação, redirecionando o usuário á página inicial
##### CFA3: operação impossível
###### FA-1: Dinheiro insuficiente
1. O sistema fornecerá um botão Transferência.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário digitará o valor da transferência, que será acima do que ele tem atualmente na conta e chave pix a qual deseja transferir o dinheiro.
5. O sistema validará os dados e avisará ao usuário que a quantia monetária selecionada excede os recursos disponíveis na conta.

###### FA-2: Destinatário inexistente
1. O sistema fornecerá um botão Transferência.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário colocará um pix inexistente e o valor monetário desejado.
5. O sistema validará os dados, e requisitará que o usuário digite o pix de um usuário existente.

### CDU 04
Cadastro de investimentos

#### Atores
- admin

#### Fluxo Principal
1. O sistema exibe um botão "Administradores" na página principal do admin.
2. O admin clica no botão.
3. O admin é redirecionado para a página sobre ações de administradores.
4. O sistema exibe um botão "Criar fundo imobiliário" na página de administradores.
5. O sistema redireciona o usuário para a página de cadastro de investimentos.
6. O sistema exibe um formulário com os campos:
   - CPF do dono do investimento.
   - Tamanho da propriedade.
   - Tamanho a ser vendido.
   - Percentual de aluguel para investidores.
   - Nome da propriedade.
   - Nome do fundo.
   - Distrito Federal da propriedade.
7. O usuário preenche todos os campos com os dados do proprietário.
8. O usuário clica no botão "Confirmar Cadastro".
9. O sistema valida os dados (campos obrigatórios, valores numéricos válidos)
   - valida a consistência dos dados (ex.: CPF existente, valores positivos)
   - salva o investimento no banco de dados.
10. O sistema envia uma confirmação de cadastro bem-sucedido.
11. O sistema exibe a mensagem: "Investimento registrado com sucesso!" e redireciona o usuário para a página inicial.
#### fluxo alternativo
##### CFA-1: Alteração de rota
   ###### FA-1: canelamento de entrar na página de cadastro de investimentos
      1. O sistema exibe um botão "Administradores" na página principal do admin.
      2. O admin clica no botão.
      3. O admin é redirecionado para a página sobre ações de administradores.
      4. O sistema exibe um botão "Criar fundo imobiliário" na página de administradores.
      5. O sistema redireciona o usuário para a página de cadastro de investimentos.
      6. O admin clicará no botão de cancelamento.
      7. O sistema o rediorecionará a página principal dos admins.
   ###### FA-2: cancelamento do preenchimento do formulário
      1. O sistema exibe um botão "Administradores" na página principal do admin.
      2. O admin clica no botão.
      3. O admin é redirecionado para a página sobre ações de administradores.
      4. O sistema exibe um botão "Criar fundo imobiliário" na página de administradores.
      5. O sistema redireciona o usuário para a página de cadastro de investimentos.
      6. O sistema redireciona o usuário para a página de cadastro de investimentos.
      7. O sistema exibe um formulário com os campos:
         - CPF do dono do investimento
         - Tamanho da propriedade
         - Tamanho a ser dividido entre os fundos
         - Percentual de aluguel para investidores
         - Nome da propriedade
         - Nome do fundo
         - Distrito Federal da propriedade
      9. O sistema fornecerá também um botão de cancelamento de cadastro de investimento
      10. O usuário clicará no botão
      11. O usuário será redirecionado á página de principal do usuário.

### CDU 05
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
###### FA-3: cancelamento de formulário
1. O sistema providenciará um botão para cadastro de novos admins.
2. O admin clicará no botão para cadastrar outros admins.
3. O sistema exigirá a senha de 12 caracteres do admin.
4. O admin digitará a senha.
5. O sistema validará a senha e redirecionará o admin para a página de cadastro de admins, além de fornecer um formulário com os campos:
    - nome do novo admin
    - numero da conta do novo admin
    - cpf do novo admin
6. O sistema colocará um botão de voltar
7. O usuário apertará para voltra
8. O sistema redirecionará o usuário para a página inicial de admins
###### FA4: cancelamento da senha final
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
10. O sistema fornecerá um botão de voltar.
11. O usuário clicará no botão
12. O sistema fechará o campo de senhas
##### CFA-2: Erro de dados
###### FA-1 dados invalidos
   1. O sistema providenciará um botão para cadastro de novos admins.
   2. O admin clicará no botão para cadastrar outros admins.
   3. O sistema exigirá a senha de 12 caracteres do admin.
   4. O admin digitará a senha.
   5. O sistema validará a senha e redirecionará o admin para a página de cadastro de admins, além de fornecer um formulário com os campos:
      - nome do novo admin
      - numero da conta do novo admin
      - cpf do novo admin
   6. O usuário deixará algum campo nulo
   7. O sistema validará e retornará que o campo está vazio
###### FA-2 dados errados
   1. O sistema providenciará um botão para cadastro de novos admins.
   2. O admin clicará no botão para cadastrar outros admins.
   3. O sistema exigirá a senha de 12 caracteres do admin.
   4. O admin digitará a senha.
   5. O sistema validará a senha e redirecionará o admin para a página de cadastro de admins, além de fornecer um formulário com os campos:
      - nome do novo admin
      - numero da conta do novo admin
      - cpf do novo admin
   6. O usuário deixará algum campo errado
   7. O sistema validará e retornará que o campo está errado
###### FA-3 dados já cadastrado
   1. O sistema providenciará um botão para cadastro de novos admins.
   2. O admin clicará no botão para cadastrar outros admins.
   3. O sistema exigirá a senha de 12 caracteres do admin.
   4. O admin digitará a senha.
   5. O sistema validará a senha e redirecionará o admin para a página de cadastro de admins, além de fornecer um formulário com os campos:
      - nome do novo admin
      - numero da conta do novo admin
      - cpf do novo admin
   6. O usuário deixará algum campo com valores já cadastrados
   7. O sistema validará e retornará que o campo está com um valor cadastrado
##### CFA-3: Erro de autenticação
   ###### FA-1: Senha de acesso nula
      1. O sistema providenciará um botão para cadastro de novos admins.
      2. O admin clicará no botão para cadastrar outros admins.
      3. O sistema exigirá a senha de 12 caracteres do admin.
      4. O admin não digitará a senha.
      5. O sistema fornecerá o botão de confirmar senha
      5. O usuário clicará em enviar senha
      6. O sistema validará e retornará que a senha é nula.
   ###### FA-2: Senha de acesso inválida
      1. O sistema providenciará um botão para cadastro de novos admins.
      2. O admin clicará no botão para cadastrar outros admins.
      3. O sistema exigirá a senha de 12 caracteres do admin.
      4. O admin digitará a senha de forma inválida.
      5. O sistema fornecerá o botão de confirmar senha
      5. O usuário clicará em enviar senha
      6. O sistema validará e retornará que a senha é inválida.
   ###### FA-3: Senha de acesso errada
      1. O sistema providenciará um botão para cadastro de novos admins.
      2. O admin clicará no botão para cadastrar outros admins.
      3. O sistema exigirá a senha de 12 caracteres do admin.
      4. O admin digitará a senha errada.
      5. O sistema fornecerá o botão de confirmar senha
      5. O usuário clicará em enviar senha
      6. O sistema validará e retornará que a senha está errada.
   ###### FA-4: senha de confirmação nula
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
      10. O admin não digitará a senha de 12 dígitos e clicará em confirmar.
      11. O sistema validará e dirá que a senha está nula.
   ###### FA-5: senha de confirmação errada
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
      10. O admin digitará a senha de 12 dígitos errada e clicará em confirmar.
      11. O sistema validará e dirá que a senha está errada.
   ###### FA-6: senha de confirmação inválida
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
      10. O admin não digitará a senha de 12 dígitos e clicará em confirmar.
      11. O sistema validará e dirá que a senha está inválida.
### CDU 06
Excluir Admin

#### Atores
- Admin

#### Fluxo Principal
   1. O sistema fornecerá um botão para apagar outros admin na pagina inical de admin.
   2. O admin clicará no botão.
   3. uma confirmaçãp.
   4. O admin clicará no botão de confirmar.
   5. O sistema terminará a conta do admin, além de exibir ao admin que está efetuando a deleção uma mensagem de exclusão efetuada.

#### Fluxo alternativo
##### CFA-1: Alteração de rota
###### FA-1: Abortação de operação 1
1. O sistema fornecerá um botão para apagar outros admin na pagina inical de admin.
2. O admin clicará no botão.
3. O sistema requisitará a confirmação.
4. O admin clicará o botão cancelar.
5. O sistema fechará o modal.

### CDU 07
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

#### Fluxo Alternativo
##### CFA-1: Cancelamento de Edição

###### FA-1: Cancalemento de Edição de Senha
1. Usuário entrará nas Edições selecionando a opção de Editar Perfil.
2. Sistema redicionará usuário para a página de Edição de Perfil, mostrando as segiuntes opções:
   - Troca de Ícone
   - Troca de Senha
   - Troca de Email
   - Troca de Nome
3. Em quaisquer escolha do usuário, dentre estas opções, sistema estará mostando um campo onde deverá ser fornecido a Senha do usuário
4. Caso a Senha for Inválida, sistema estará retornando o mesmo campo sinalizando Credenciais Inválidas em vermelho, pressionando o usuário à repetir a senha Válida para prosseguir.
5. Caso a senha for Válida, sistema estará fechando este campo e abrindo outro, mostrando a Troca que solicita (Ícone, Senha ou Email)
   - Caso Email, será solicitado o novo Email, depois um botão de Confirmação e um de Cancelar ao lado.
   - Caso Nome, será solicitado o novo Nome, depois um botão de Confirmação e um de Cancelar ao lado.
   - Caso Senha, será solicitado nova Senha, depois um botão de Confirmação e um de Cancelar ao lado.
   - Caso Ícone, será solicitado um arquivo (png, jpg, wbem) ou uma foto, onde usuário deve entregar acessibilidade da câmera.
      2. Entregue o arquivo, ou a foto retirada, aparecerá um botão de Confirmação e um de Cancelar ao lado.
6. Usuário irá pressionar a opção de Cancelar.
7. O sistema irá redirecionar o usuário para a página de Edição de Perfil.

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

#### Fluxo Alternativo
##### CFA-1: Dados Errados

###### FA-1: Senha Incorreta 
1. O usuário clicou no botão de investimentos.  
2. O sistema redirecionou para a página de investimentos.  
3. O usuário selecionou um investimento.  
4. O usuário acessou a página do investimento selecionado.  
5. O usuário clicou no botão "Investir".  
6. O sistema pediu a senha de 7 dígitos.  
7. O usuário digitou uma senha incorreta.  
8. O sistema exibiu: "Senha inválida. Tente novamente."

##### CFA-1: Alteração de Rota

###### FA-1: Investimento Bloqueado Temporariamente 
1. O usuário digitou a senha correta. 
2. O sistema pediu a senha de 7 dígitos.   
3. O usuário tentou investir várias vezes.  
4. O sistema exibiu: "Você não pode investir várias vezes em um mesmo fundo." 