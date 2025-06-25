# Documento de Casos de Uso

## Lista dos Casos de Uso

 - [CDU 01](#CDU-01): Criação de contas.
 - [CDU 02](#CDU-02): Login
 - [CDU 03](#CDU-03): Transferências
 - [CDU 04](#CDU-04): Vizualização de Extrato
 - [CDU 05](#CDU-05): Cadastro de investimentos


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

#### Fluxo Alternativo A

1. Pellentesque id mauris id ex fringilla iaculis.
2. Maecenas ut dui at sapien rhoncus porttitor in sed turpis.
3. Maecenas fringilla augue id sodales volutpat.
4. Nulla vehicula lectus eu eros faucibus porta.
5. Morbi non sem in diam dictum aliquet sit amet at metus.
6. Aenean dictum diam in tempus ornare.

#### Fluxo Alternativo B

1. Ut elementum dolor id lorem elementum, et condimentum eros laoreet.
2. Nulla sollicitudin arcu nec suscipit volutpat.
3. Aliquam mattis sapien nec ornare faucibus.
4. Sed eu massa nec enim condimentum commodo at eget ligula.
5. Nam ultricies velit nec erat feugiat condimentum.
6. Nam vitae lacus porttitor, sodales orci vel, lobortis arcu.

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

### CDU-03

Transferências

#### Atores

 - User

#### Fluxo Principal

1. Primeiro o usuário precisará logar na sua conta.
2. O sistema fornecerá um botão com o simbolo de dinheiro localizado na tela princial de usuário.
3. O usuário clicará no botão.
4. O usuário será redirecionado a outra página com um formulário com os campos valor e chave pix da conta.
5. O usuário digitará o valor da transferência e chave pix a qual deseja trasnferir o dinheiro.
6. Os dados serão verificados no frontend.
7. Os dados serão enviados ao backend.
8. Os dados serão checados e validados no backend.
9. A validação dos dados será retornada ao frontend
10.O usuário será redirecionado a uma outra página com o nome do remente e destinatário, chave pix e valor da transferência.
11. O sistema terá o botão verde com o texto confirmar embaixo da tela.
12. O usuário digitará a senha de sete dígitos.
13. O frontend validará a senha.
14. Os dados serão envidados ao backend.
15. Os dados sofrerão a verificação
16. O backend realiza a transferência da quantia.
17. O backend retorna que a operação foi bem sucedida.
18. O usuário é redirecionado a tela principal e recebe o pop up de operação sucedida.
#### Fluxo Alternativo A

1. Nulla elementum diam eu elementum rutrum.
2. Aenean scelerisque est at nunc ornare, ac condimentum justo sollicitudin.
3. Quisque eget risus ut est lacinia sollicitudin ac non diam.
4. Quisque ac nulla convallis, lobortis nibh ac, tristique enim.
5. Nulla ultricies metus nec risus mollis, interdum ultrices justo malesuada.

### CDU 04

Vizualização de Extrato

#### Atores

User

#### Fluxo Principal

1. O sistema fornecerá um botão para consulta do extrato
2. O usuário clicará no botão
3. O usuário será redirecionado para a página de saldo
4. O frontend enviará o número da conta para o backend
5. O backend usará o numero da conta para buscar todas as transferências bancárias que ocorreram
6. O backend retornará essas transferências
7. O sistema exibirá esse histórico de transferêncas

#### Fluxo Alternativo A

1. Aliquam efficitur arcu ac fermentum egestas.
2. Pellentesque ac diam vitae erat bibendum hendrerit.
3. Mauris sed purus sit amet lectus efficitur placerat et eu diam.
4. Aenean ullamcorper tellus quis nibh porttitor congue.
5. Phasellus laoreet erat eget condimentum dictum.

### CDU 05

Cadastro de investimentos

#### Atores

Admin

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