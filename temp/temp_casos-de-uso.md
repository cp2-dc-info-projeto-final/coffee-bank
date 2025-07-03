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
 - [CDU 21](#cdu-19): Excluir categoria de unidade monetária
 - [CDU 22](#cdu-20): Editar categoria de unidade monetária
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
1. O site fornece um formulário de criação de contas.
2. O usuário precisará fornecer o seu CPF/RG, uma senha de 5 digitos e sua confimação, uma senha de 7 digitos e sua confimação, sua data de nascimento e o seu nome.
3. O usuário apertará em enviar e mandará a requisição.
4. Os dados serão verificados pelo frontend e caso seja aceito os dados serão enviados para o backend.
5. Os dados serão verificados para o backend e caso seja aceito será criado a conta e retornada o Id da conta o usuário.

**Diagrama de sequência XX**

![Diagrama de Sequência](diagramas/diagrama-exemplo.png)


### CDU 02

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

### CDU 03

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

### CDU 09 
- Editar Administradores

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

### Atores

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

### CDU 11

Buscar e consultar usuários

#### Atores

- Admin

#### Fluxo Principal

1. O sistema fornecerá um botão de gerenciamento de usuário
2. O Admin clicará no botão de gerenciamento
3. O sistema requisitará a senha de 12 caracteres
4. O Admin digitará a senha
5. O frontend verificará a senha
6. O frontend enviará a senha para o backend
7. O backend validará a senha
8. O backend retornará que a senha está errada
9. O frontend redicionara o admin para a página de gerenciamento de usuários
10. O frontend requisitará os dados ao backend
11. O backend enviará os dados dos usuários
12. O frontend exibirá os dados

### CDU 12
- Notificação Via Usuário

#### Atores
- User/Sistema

#### Fluxo Principal  
1. Evento disparador ocorre (Exemplo: usuário edita dados cadastrais, cancela conta, realiza transação relevante)  
   - Sistema identifica o tipo de evento e o usuário afetado  

2. Sistema gera notificação  
   - Monta mensagem padronizada conforme o evento:  
     - Exemplo 1 (edição): "Seus dados foram atualizados em [data/hora]"  
     - Exemplo 2 (cancelamento): "Conta encerrada com sucesso. Código: [protocolo]"  
   - Adiciona metadados: timestamp, criticidade (baixa/média/alta)  

3. Sistema envia notificação
   - Canais prioritários (configuráveis pelo usuário):  
     - Push notification (app)  
     - E-mail  
     - SMS  
   - Regra de multi-canal: Eventos críticos disparam em ≥ 2 canais  

4. Registro e confirmação 
   - BackEnd registra no banco de dados:  
     ```json
     {
       "user_id": "12345",
       "tipo": "conta_cancelada",
       "canais": ["app", "email"],
       "status": "entregue"
     }
     ```
   - Sistema atualiza histórico de notificações do usuário  

5. Usuário recebe e visualiza 
   - Notificação aparece no painel do usuário (app/web)  
   - Sistema marca como "lida" quando aberta  

### Regras de Negócio  
| Contexto                     | Regra                                                                 |
|------------------------------|-----------------------------------------------------------------------|
| **Tempo de entrega**         | Notificações críticas: ≤ 1 minuto; Demais: ≤ 15 minutos              |
| **Personalização**           | Incluir nome do usuário e últimos 4 dígitos da conta                  |
| **Cancelamento de conta**    | Notificação obrigatória + comprovante em PDF anexado via e-mail       |
| **Edição de dados sensíveis**| Notificação imediata com opção "Reverter alteração" (link válido 1h)  |

### Exemplo de Implementação  
- Evento: Usuário cancela conta poupança  
Notificação gerada: 
> "Olá, [Nome]! Infelizmente o seu café da tarde foi cancelado!
> *Comprovante anexado neste e-mail.* Caso não tenha solicitado, marque um cafezinho com o gerente: 0800-XXX-XXXX"  

### CDU 13

Desconto automático de imposto

#### Atores

- User

#### Fluxo Principal
1. O sistema, na hora de porcessar o pagamento do user descontará uma taxa de 10% para o governo
2. O sistema descontará (lim x->∞ Σ i=0->i=x 9/(10**i))% do dinheiro como taxa do banco
3. O sistema computará o pagamento

### CDU 14

criação de automatização de pagamentos

#### Atores

- User

#### Fluxo Principal

1. O sistema fornecerá um botão para automatização de pagamentos
2. O usuário clicará no botão
3. O sistema requisitará a senha de 5 dígitos
4. O usuário digitará a sua senha de 5 dígitos
5. O frontend validará a senha
6. O frontend enviará a senha para o backend
7. O backend validará a senha
8. O backend confirmará que a senha está correta
9. O frontend redirecionará o usuário para a página de automatização de pagamentos
10. O frontend requisitará as automatizações já cadastradas do usuário
11. O backend retornará todas as automatizações do caso
12. O frontend exibirá todos os dados pegos do backend
13. O sistema fornecerá um botão para cadastrar novos pagamentos automáticos
14. O usuário clicará no botão
15. O fornecerá um formulário com os campos:
    - destinatário
    - valor
    - dia do mês
14. O usuário completará o formulário
15. O sistema fornecerá um botão de confirmação
16. O usuário clicará no botão de confirmação
17. O sistema requisitára a senha de 7 dígitos do usuário
18. O usuário digitará a senha
19. O frontend validará a senha
20. O frontend enviará os dados para o backend
21. O backend verificará os dados
22. O backend cadastrará o pagamento automático
23. O backend retornará que a operação foi um sucesso
24. O frontend exibirá que a operação foi um sucesso
25. Toda a meia noite o backend realizará todas as transferências cadastradas para aquele dia do mês

### CDU 15

Supervisionamento do saldo

#### Atores

- User

#### Fluxo Principal

1. O sistema fornecerá um botão para vizualizar o supervisionamento do saldo.
2. O usuário clicará nesse botão.
3. O sistema requisitará a senha de 5 dígitos
4. O usuário digitará a senha
5. O frontend validará a senha
6. O frontend enviará a senha para o backend
7. O backend validará a senha
8. O backend retornará que a senha está correta
9. O frontend redirecionará o usuário para a página de vizualização de extrato
10. O frontend requisitará as transações feitas nos ultimos 12 meses
11. O backend retornará as transações feitas nos ultimos 12 meses pára o frontend
12. O frontend organizará a exibição em um gráfico
13. O frontend exibirá o gráfico

### CDU 16
- Empréstimo

#### Atores
- User

#### Fluxo Principal  
1. Usuário acessa a seção de empréstimos 
   - No app/internet banking, seleciona "Empréstimos" → "Novo Empréstimo"  
   - Sistema exibe opções disponíveis (pessoal, consignado, CDC)  

2. Seleção e simulação 
   - Usuário escolhe o tipo de empréstimo e preenche:  
     - Valor solicitado  
     - Número de parcelas  
   - Sistema calcula e mostra em tempo real:  
     - Valor da parcela  
     - CET (Custo Efetivo Total)  
     - Data prevista de quitação  

3. Formalização da proposta  
   - Usuário confirma os dados  
   - Sistema solicita:  
     - Finalidade do empréstimo (menu dropdown)  
     - Confirmação de renda (com upload opcional de holerite)  
     - Aceite dos termos legais  

4. Análise automática 
   - BackEnd verifica em tempo real:  
     - Score de crédito  
     - Limite disponível  
     - Compatibilidade renda/parcela (regra: parcela ≤ 30% da renda)  
   - Sistema gera pré-aprovação imediata (ou negação com justificativa)  

5. Validação e contratação  
   - Se aprovado:  
     - Sistema exibe contrato digital com assinatura eletrônica  
     - Usuário confirma com senha/2FA  
     - BackEnd registra operação e dispara notificação (CDU 12):  
       *"Empréstimo contratado! R$X,XX creditados em conta em até 2h"*  
   - Se reprovado:  
     - Sistema sugere alternativas (valor menor, mais parcelas)  

6. Liberação de recursos 
   - Crédito disponibilizado na conta corrente vinculada  
   - Sistema atualiza extrato com evento:  
     "Crédito - Empréstimo Pessoal [protocolo]" 

### Pós-Contratação 
- Usuário pode:  
  - Consultar débitos restantes  
  - Antecipar parcelas (com desconto)  
  - Baixar cópia do contrato  
> ✅ Compliance: Todas as etapas registradas em audit trail (data/hora, IP, versão de contrato).  

### CDU 17

Vizualização de Categoria da unidade monetária

#### Atores

- User

#### Fluxo Principal

1. O sistema irá fornecer um botão de categorização da unidade monetária
2. O usuário irá clicar nesse botão
3. O sistema requisitará a senha de 5 dígitos
4. O usuário digitará  a senha
5. O frontend validará a senha
6. O frontend enviará a senha para o backend
7. O backend validará a senha 
8. O backend enviará que a senha está correta
9. O frontend redirecionará o usuário para a página de categorização monetária
10. O frontend requisitará as categorias que aquele usuário criou
11. O backend enviará todas as categorias cadastradas no banco de dados.
12. O frontend exibirá esses dados em formato de gráfico de pizza.

#### Fluxos Alternativos



### CDU-18
Investimentos em cafezais

#### Atores
- User

#### Fluxo Principal
1. O frontend fornecerá um botão de investimentos na página principal.
2. O usuário apertará no botão.
3. O frontend requisitará ao backend uma busca por investimentos atualmente disponiveis.
4. O backend fará a busca
5. O backend mandará os investimentos encontrados de volta para o frontend.
6. O frontend ajeitará essas informações na página de investimentos. 
7. O usuário será redirecionado a página de investimentos com todos os investimentos possíveis dele realizar.
8. O usuário selecionará um investimento.
9. O usuário será redirecionado a página do investimento selecionado onde haverá:
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
10. O usuário apertará no botão.
11. O sistema fornecerá um campo onde será requisitado a senha de 7 digítos do usuário

### CDU 19
   Excluir categoria de unidade monetária

#### Atores
   - User

#### Fluxo Principal
   1. O sistema irá fornecer um botão de categorização da unidade monetária.
   2. O usuário irá clicar nesse botão.
   3. O sistema requisitará a senha de 5 dígitos.
   4. O usuário digitará  a senha.
   5. O frontend validará a senha.
   6. O frontend enviará a senha para o backend.
   7. O backend validará a senha .
   8. O backend enviará que a senha está correta.
   9. O frontend redirecionará o usuário para a página de categorização monetária.
   10. O frontend requisitará as categorias que aquele usuário criou.
   11. O backend enviará todas as categorias cadastradas no banco de dados.
   12. O frontend exibirá esses dados em formato de gráfico de pizza.
   13. O sistema fornecerá um botão de gerenciar categorias.
   14. O usuário clicará nesse botão.
   15. O usuário será redirecionado para a página de gerenciamento de categorias.
   16. O frontend requisitará as categorias monetárias desse usuário.
   17. O backend retornará as categorias monetárias criadas.
   18. O frontend exibirá as categorias em lista com um botão de excluir.
   19. O usuário clicará no botão de excluir.
   20. O frontend requisitará a exclusão para o backend.
   21. O backend excluirá da categoria no banco de dados.
   22. O backend retornará que a categoria foi excluida com sucesso.
   23. O frontend requisitará novamente as categorias cadastradas por aquele usuário.
   24. O backend retornará as categorias daquele usuário.
   25. O frontend reorganizará esses dados.

### CDU 20
   editar categoria de unidade monetária

#### Atores
   - User

#### Fluxo Principal
   1. O sistema irá fornecer um botão de categorização da unidade monetária.
   2. O usuário irá clicar nesse botão.
   3. O sistema requisitará a senha de 5 dígitos.
   4. O usuário digitará  a senha.
   5. O frontend validará a senha.
   6. O frontend enviará a senha para o backend.
   7. O backend validará a senha .
   8. O backend enviará que a senha está correta.
   9. O frontend redirecionará o usuário para a página de categorização monetária.
   10. O frontend requisitará as categorias que aquele usuário criou.
   11. O backend enviará todas as categorias cadastradas no banco de dados.
   12. O frontend exibirá esses dados em formato de gráfico de pizza.
   13. O sistema fornecerá um botão de gerenciar categorias.
   14. O usuário clicará nesse botão.
   15. O usuário será redirecionado para a página de gerenciamento de categorias.
   16. O frontend requisitará as categorias monetárias desse usuário.
   17. O backend retornará as categorias monetárias criadas.
   18. O frontend exibirá as categorias em lista com um botão de editar.
   19. O usuário clicará no botão de editar.
   20. O sistema fornecerá um formulário com os valores:
      - Nome da categoria.
      - porcentual que ela representa.
   21. O usuário preencherá o formulário.
   22. O Sistema fornecerá o botão de confimar.
   23. O usuário clicará no botão.
   24. O frontend requisitará a edição para o backend
   25. O backend editará da categoria no banco de dados.
   26. O backend retornará que a categoria foi excluida com sucesso.
   27. O frontend requisitará novamente as categorias cadastradas por aquele usuário.
   28. O backend retornará as categorias daquele usuário.
   29. O frontend reorganizará esses dados.