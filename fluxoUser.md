# Fluxos de Usuário 

## Criação de contas
O usuário poderá criar novas contas para ele, desde que seu CPF não esteja atrelado a outra conta, utilizar na hora do login.
Uma vez criada o login, o usuário poderá usar esse usuário e senha para logar e fazer as transações entre as contas.
Para a criação da conta, será necessário a atrelação a seu CPF/RG.
Em caso de conta para menor de idade deverá haver a atrelação do CPF/RG do responsável legal juntamente ao do menor de idade.

## Depósitos
Uma vez possuindo uma conta, o usuário precisará depositar a sua semente de café pelo ponto físico do banco.
Após o depósito, todos os usuário receberam uma notificação de depósito realizado via SMS/Email.

## Extrato
O usuário poderá vizualizar as informações do fluxo de dinheiro da sua conta.
Uma vez solicitada a visualização do extrato bancário, serão mostrados todos os depósitos, transferências, saques e investimentos realizados.

## Transferência
Uma vez que o usuário pedir a transferência para uma outra conta.
Será requisitado a chave da conta da conta para a qual será feita a transferência, a senha da conta do usuário, então sera checado os dados de tranferência , e caso não tenha nenhum problema nos dados será enviado o dinheiro do remente ao destinatário.

## Cadastro de investimentos pelos donos de cafezais
O agricultor poderá ir a uma agência e solicitar a um gerente o cadastramento de um novo investimento de fundo imobiliário atrelado a sua fazenda.
Ocorrerá logo em seguida a verificação de seus dados, se o dono de cafezal possuir pagamentos de investimentos pendentes, todo o seu lote dividido em fundos, pagamentos de dividados atrasados ou uma movimentação bancária de menos de 1000000 CFS ele não poderá cadastrar um investimento.
Serão requisitado os dados do número da conta do produtor, o intervalo de pagamento, quantos ativos serão, e qual a área que será dividida entre os fundos imobiçiários.

## Investimentos em cafezais
Os investimentos em fazendas serão pautados em fundos imobiliários cadastrados por donos de fazendas de café através do sistema do banco.
Terá uma aba a qual será exibidido todos os investimentos podendo ser filtrado por preço, aluguel relativo(%), aluguel fixo($CF), hectares equivalente, nome do produtor e/ou região.
Nessa aba o usuário poderá escolher o investimento o qual deseja, e vizualizar as informações do fundo.

## Gerenciamento via Admin
O gerente poderá fazer o gerenciamento de outros admin, e de usuário podendo executar o cancelamento de contas, edição de contas, e cadastramento de contas.

## Gerenciamento de senhas
O usuário poderá pedir a alteração de sua senha, desde que esteja cadastrado com a conta em seu celular.
Será requisitado a agência e o número da conta que quer ser alterada.
E por fim, será requisitado, qual senha o usuário quer alterar junto com a nova senha e sua reescrita para a confirmação da senha.

## Buscar e consultar usuários
O gerente poderá buscar e visualizar as informações dos usuário.
O gerente pesquisará por agência, numero de conta, nome, nível de movimento bancário e/ou CPF, mostrando então todos os usuário com aquelas características.

## Supervisionamento do saldo de café
O usuário poderá requisitar a visualização de seu saldo ao longo do tempo filtrando por tempo, valor, destinatário ou remetente.
Uma vez requisitado o saldo o usuário será exibido em gráfico de acordo com os dados requisitados pelo usuário.

## Empréstimos
O usuário poderá pedir para pegar um empréstimo com o banco negociando um valor, número de parcelas, intervalo das parcelas.
O gerente mandará a verificação para o backend e, quando verificado, e aprovado, será calculado o valor total e de cada parcela.

## Notificação via email
O usuário, uma vez cadastro o email vinculado a conta, será notificado de cada transação realizada em sua conta pelo email.

## Desconto automático de imposto
Uma vez feito o investimento serão descontados automaticamente um imposto 10% e (lim x->∞ Σ i=0->i=x 9/(10**i))% de taxa do banco toda vez que o usuário receber ou fizer algum pagamento de investimento.

## Automatização de pagamentos
O usuário pode definir uma data de início para um pagamento regular de n em n dias que será executado de forma automática no servidor.

## Categorização do unidade monetária
Na hora de usar seu dinheiro o usuário pode requisitar dividir seu dinheiro em i partes de n% de seu montante total, tendo seu valor exibido de forma dividida em categorias.
