# Documento de Casos de Uso

## Lista dos Casos de Uso

 - [CDU 01](#CDU-01): Criação de contas.
 - [CDU 02](#CDU-02): Morbi fringilla dolor at mattis vestibulum.
 - [CDU 03](#CDU-03): Duis nec orci quis velit faucibus hendrerit tempus vel libero.


## Lista dos Atores

 - User

## Diagrama de Casos de Uso

![Diagrama de Casos de Uso](diagramas/diagrama-exemplo.png)

## Descrição dos Casos de Uso

### CDU 01

Criação de contas.

#### Atores

1. Cras tempor
2. Donec a lorem

#### Fluxo Principal
O usuário poderá criar novas contas para ele, desde que seu CPF não esteja atrelado a outra conta, utilizar na hora do login.
Uma vez criada o login, o usuário poderá usar esse usuário e senha para logar e fazer as transações entre as contas.
Para a criação da conta, será necessário a atrelação a seu CPF/RG.
Em caso de conta para menor de idade deverá haver a atrelação do CPF/RG do responsável legal juntamente ao do menor de idade.

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


### CDU 02

Morbi fringilla dolor at mattis vestibulum.

#### Atores

1. Cras tempor

#### Fluxo Principal

1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
2. Mauris varius massa ac fermentum scelerisque.
3. Morbi in tortor dignissim, bibendum tellus et, varius odio.
4. Mauris egestas leo a suscipit feugiat.

#### Fluxo Alternativo A

1. Nulla elementum diam eu elementum rutrum.
2. Aenean scelerisque est at nunc ornare, ac condimentum justo sollicitudin.
3. Quisque eget risus ut est lacinia sollicitudin ac non diam.
4. Quisque ac nulla convallis, lobortis nibh ac, tristique enim.
5. Nulla ultricies metus nec risus mollis, interdum ultrices justo malesuada.

### CDU 03

Duis nec orci quis velit faucibus hendrerit tempus vel libero.

#### Atores

1. Donec a lorem

#### Fluxo Principal

1. Praesent interdum lectus sit amet augue tincidunt imperdiet.
2. Duis ac dolor vel nisi imperdiet vehicula et non sem.
3. Nunc imperdiet tortor consequat, lobortis purus non, interdum risus.

#### Fluxo Alternativo A

1. Aliquam efficitur arcu ac fermentum egestas.
2. Pellentesque ac diam vitae erat bibendum hendrerit.
3. Mauris sed purus sit amet lectus efficitur placerat et eu diam.
4. Aenean ullamcorper tellus quis nibh porttitor congue.
5. Phasellus laoreet erat eget condimentum dictum.
