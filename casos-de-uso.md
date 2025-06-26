# Documento de Casos de Uso

## Lista dos Casos de Uso

 - [CDU 01](#CDU-01): Criação de contas.
 - [CDU 02](#CDU-02): Login
 - [CDU 03](#CDU-03): Transferências
 - [CDU 04](#CDU-04): Vizualização de Extrato
 - [CDU 05](#CDU-05): Cadastro de investimentos
 - [CDU 06](#CDU-06): Cancelamento de contas
 - [CDU 07](#CDU-07): Cadastramento de admins
 - [CDU 08](#CDU-08): exclusão de admins

## Lista dos Atores

 - User
 - Admin

## Diagrama de Casos de Uso

![Diagrama de Casos de Uso](diagramas/diagrama-exemplo.png)

## Descrição dos Casos de Uso

### CDU-01

Criação de contas.

#### Atores
 - User
#### Fluxo Principal
1. O site fornece um formulário de criação de contas.
2. O usuário precisará fornecer o seu CPF/RG, uma senha de 5 digitos e sua confimação, uma senha de 7 digitos e sua confimação, sua data de nascimento e o seu nome.
3. O usuário apertará em enviar e mandará a requisição.
4. Os dados serão verificados pelo frontend e caso seja aceito os dados serão enviados para o backend.
5. Os dados serão verificados para o backend e caso seja aceito será criado a conta e retornada o Id da conta o usuário.

**Diagrama de sequência XX**

![Diagrama de Sequência](diagramas/diagrama-exemplo.png)


### CDU-02

Login

#### Atores
- User

#### Fluxo Principal
1. O frontend fornecerá um botão de login na página principal.
2. O usuário apertará no botão.
3. O usário será redirecionado ao form de login com os campos de senha de 7 dígitos e numero da conta.
4. O usuário preencherá os campos.
5. O usuário apertará o botão verde de confirmação.
6. O frontend validará os dados.
7. O frontend enviará os dados para o Backend.
8. O backend fará a verificação se os dados correspondem a uma conta.
9. O backend retornará o nome, saldo e numero da conta
10. O frontend redirecionarà o usuário para a pagina principal de seu respectivo tipo de agente.

### CDU-03

Transferências

#### Atores

- User

#### Fluxo Principal

1. O sistema fornecerá um botão com o simbolo de dinheiro localizado na tela princial de usuário.
2. O usuário clicará no botão.
3. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
4. O usuário digitará o valor da transferência e chave pix a qual deseja trasnferir o dinheiro.
5. Os dados serão verificados no frontend.
6. Os dados serão enviados ao backend.
7. Os dados serão checados e validados no backend.
8. A validação dos dados será retornada ao frontend
9. O usuário será redirecionado a uma outra página com o nome do remente e destinatário, chave pix e valor da transferência.
10. O sistema terá o botão verde com o texto confirmar embaixo da tela.
11. O usuário digitará a senha de sete dígitos.
12. O frontend validará a senha.
13. Os dados serão envidados ao backend.
14. Os dados sofrerão a verificação
15. O backend realiza a transferência da quantia.
16. O backend retorna que a operação foi bem sucedida.
17. O usuário é redirecionado a tela principal e recebe o pop up de operação sucedida.

### CDU 04

Vizualização de Extrato

#### Atores

- User

#### Fluxo Principal

1. O sistema fornecerá um botão para consulta do extrato
2. O usuário clicará no botão
3. O usuário será redirecionado para a página de saldo
4. O frontend enviará o número da conta para o backend
5. O backend usará o numero da conta para buscar todas as transferências bancárias que ocorreram
6. O backend retornará essas transferências
7. O sistema exibirá esse histórico de transferêncas

### CDU 05

Cadastro de investimentos

#### Atores

- Admin

#### Fluxo Principal

1. O usuário irá até a agência conversar com o gerente.
2. O sitema providenciará um botão com o redirencionamento para a pagina de cadastro de investimentos localizada na pagina principal de usuários admin.
3. O Admin(gerente) clicará no botão para ir para o formulário.
4. O admin será redirecionado a página de login.
5. O frontend fornerá um login com as informações de
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
7. O frontend fornecerá um botão de confirmar ao fim do formulário.
8. O usuário apertará esse botão de confirmar
9. O frontend validará os dados
10. O frontend enviará os dados para o backend
11. O Backend validará os dados
12. O backend verificará se o propietário pode pedir um investimento
13. O backend registrará o investimento
14. O backend retornará que o cadastro foi bem sucedido.
15. A mensagem será exibida pelo frontend

### CDU 06

cancelamento de contas

#### Atores

- Admin

#### Fluxo Principal
1. O sistema oferecerá um botão de gerenciamento de usuário.
2. O admin clicará no botão de gerenciamento de usuário.
3. O sitema pedirá a confirmação via senha de admin de 12 dígitos.
4. O admin fornecerá a senha
5. O frontend verificará a senha.
6. O frontend enviará a senha para o frontend
7. O backend verificará a senha
8. O backend retornará que a senha está correta
9. O sistema redirecionará o admin à página de gerenciamento de usuário.
10. O frontend requisitará todos os usuários para o backend.
11. Aparecerá todos os usuário com um botão para excluir o usuário logo a direita.
12. O admin apertará no botão de excluir.
13. O sistema requisitára a senha de 12 caractéres do usuário.
14. O admin fornecerá a senha
15. O frontend verificará a senha fornecida.
16. O frontend mandará os dados para o backend
17. O backend verificará a senha
18. O backend excluirá o usuário do banco de dados
19. O backend retornará que a senha está coreta.
20. O frontend exibirá que o usuário foi excluido.

### CDU 07

cadastramento de admins

#### Atores

- Admin

#### Fluxo Principal

1. O sistema providenciará um botão para cadastro de novos admins.
2. O admin clicará no botão para cadastrar outros admins.
3. O sistema exigirá a senha de 12 caracteres do admin.
4. O admin digitará a senha..
5. O frontend verificará a senha.
6. O frontend enviará os dados para o backend.
7. O backend validará a senha.
8. O backend retornará que a senha está correta.
9. O frontend redirecionará o usuário para a página de cadastro de usuários.
10. O sistema fornecerá um formulário com os campos:
    - nome do novo admin
    - numero da conta do novo admin
    - cpf do novo admin
11. O admin completará os campos do formulário com as informações do novo admin que será cadastrado.
12. O sistema fornecerá um botão de confirmar cadastro.
13. O admin clicará no botão de confirmar cadastro.
14. O sistema pedirá a senha de 12 dígitos.
15. O admin digitará a senha de 12 dígitos.
16. O frontend validará a senha.
17. O frontend manda os dados para o backend.
18. O backend validará os dados.
19. O backend criará uma senha de 12 dígitos aleatórios para aquele admin.
20. O backend criará o novo admin.
21. O backend retornará que o usuário foi criado e a senha correspondente aquele usuário.
22. o frontend exibirá que o usuário foi criado e qual é a sua senha respectiva.

### CDU 08

excluir admin

#### Atores

- Admin

#### Fluxo Principal

1. O sistema fornecerá um botão para apagar outros admin na pagina inical de admin.
2. O admin clicará no botão.
3. O sistema requisitará a senha de 12 dígitos.
4. O admin escreverá a senha.
5. O frontend validará a senha.
6. O frontend enviará a senha para o frontend.
7. O backend validará a senha
8. O backend enviará que a senha está correta.
9. O frontend redirecionará o usuário para a página de gerenciamento de admins.
10. O frontend requisitára ao backend os dados dos admins
11. O backend retornará os dados para o frontend
12. O frontend exibirá todos os admins com o botão apagar admin.
13. O admin clicará no botão de apagar admin.
14. O sistema requisitará a senha de 12 dígitos
15. O admin escreverá sua senha.
16. O frontend validará a senha.
17. O frontend enviará a senha para o backend.
18. O backend validará a senha.
19. O backend excluirá o admin do banco de dados.
20. O backend retornará que a operação foi um sucesso.
21. O frontend exibirá que a operação foi um sucesso.
### CDU 09 - Editar Administradores

### Atores
- Admin

#### Fluxo Principal

1. Na página de gerenciamento, cada admin listado tem botão "Editar"

2. Ao clicar, sistema exibe modal/formulário com:
   - Campos editáveis (nome, conta);
   - Usuário Digita Campos Editáveis;
   - Admin Preenche Formulário;
   - Sistema Oferece Botão De Confirmar

3. Admin faz alterações necessárias

4. Ao confirmar (BackEnd e FrontEnd):
   - Sistema Exige Senha;
   - A Senha É Digitada Pelo Admin;
   - FrontEnd Envia Os Dados Para O BackEnd;
   - FrontEnd Envia Pacote De Atualização Para BackEnd;
   - BackEnd Verifica Os Dados E A Senha;
   - BackEnd Aplica Alterações E Retorna, Dizendo Que Foi Um Sucesso
   
### CDU 10

alterar senha

#### Atores

- User

#### Fluxo Principal
1. O sistema fornecerá o botão de alterar senha
2. O usuário apertará no botão de alterar senha
3. O frontend redirecionará o usuário para a pagina de alteração de senha 
4. O frontend mostra um formulário com 3 campos:
    - id da conta
    - senha nova
    - confirmação da nova senha
5. O front verifica se a conta e senha é valida
6. O front envia os dados para o backend
7. O backend valida os dados
8. O backend retorna que a conta é válida 

9. O frontend envia a solicitação do envio de um código para o email
10. O backend sorteia um código de 6 caracteres
11. O backend envia o código sorteado para o email
12. O usuário digita o código
13. O front valido o código
14. O front envia o código para o backend
15. O backend verifica se o código é o mesmo
16. O backend retorna que o código é valido
17. O front redireciona o usuário para a página de login
18. O frontend exibe que a senha foi alterada
