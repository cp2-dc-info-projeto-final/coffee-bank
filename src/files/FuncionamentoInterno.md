# Funcionamento interno
## Objetivo
Nesse documento irei relatar como funciona esse servidor.
## estrutura de pastas
primeiro analizemos a nossa estrutura de pasta para compreensão de como os arquivos estão dispostos para a melhor manutenção do servidor.
Temos portanto a seguinte estrutura
```folder
files/
├── Class/
|    └── Ts
|       ├──archive.ts
|       ├──folder.ts
|       └──image.ts
|    └── Compiled
|        └──...
├── Controler/
|    └──ImageController.js
├── Routes/
|    └──images.routes.js
└── app.js
```
## Class/
Vamos começar portanto de cima para baixo, começando,portanto, com a pasta Class.
Essa pasta ela serve puramente para a organização, nelas estão guardadas as classes que representam os arquivos que seram manipulados
### Class/TS/
Essa pasta é utilizada para o armazenamento dos códigos das classes em Typescript
#### Class/TS/archive.ts
Esse arquivo é a base da manipulação de arquivos. Ele dita dentro de si a classe base para todas as classes de manipulação de arquivos.
##### Atributos
- path: Um atributo público do tipo string, que indica o caminho que a pasta do arquivo está em relação a pasta raiz do servidor.
- name: Um atributo públido do tipo string, que indica o nome do arquivo.
- fullPath: Um atributo público, que indica o caminho completo até o arquivo a partir da pasta raiz do servidor.  
##### Métodos
- Construtor: Instancia um novo objeto a partir dos parâmetros path e name.
- Salvar um método estático e publico que pede os parâmetros de caminho relativo a raiz do servidor e o conteúdo do arquivo:
    
        1. chama o método writeFile, usado no Javascript para escrever um arquivo, com os parâmetros path e content passando como padrão de caracteres o utf8.
        2. Caso o arquiva já tenha conteúdo, ele reescreve.
        3. Contem também um verificador de erro que retorna o erro
- read Esse método é publico, assincrono, não pede nenhum parâmetro e retorna uma string:

        1. Esse método chama o método readFile, usado no Javascript para ler arquivos, com o atributo fullpath, calculado dentro do construtor a partir dos parâmetros de path e name.
        2. retorna os dados lidos do arquivo
        3. Contém uma verificação de erro que caso dê algum erro ele retorna.
    ###### Exemplo
        Retorno: "ANGJWwanakoapehgtyaotg,aoj@#njkjkshnjoajwHO$J#%90"
- delete Esse método é publico, assincrono, não pede nenhum parâmetro e não possui retorno:
    
        1. Esse método chama a função unlink, usada no Javascript para deletar arquivos
        2. Exibe no terminal a mensagem "Arquivo deletado com sucesso!"
        3. Tem um tratamento de erros que, caso haja erro, ele retorna.

- getNome
    
        1. essa função é pública, não assincrona e retorna uma string, o atributo name.

    ###### Exemplo
        saída: "main.png"

- dadFolder essa função é pública, não assincrona e retorna uma instaciação da classe Folder:
    
        1. Esse função retorna o objeto que representa a pasta que o arquivo está guardado

    ###### Exemplo
        saída: new Folder("uploads/users/Hermenegildo")

#### Class/TS/folder.ts
Esse arquivo é responsável pela classe que lida com a manipulação de pastas, essa classes possui portanto alguns atributos e métodos para conseguir manipular as pastas que serão guardadas os arquivos.

##### Atributos
- path: um atributo privado do tipo string. Esse atributo representa o caminho até a pasta, incluindo o nome da pasta.
- FolderName: um atributo privado do tipo string. Esse atributo representa o nome da pasta.

##### métodos

-  Construtor: Instancia a classe a partir do parâmetro path.

    ```
        1. Define o atributo path como igual ao parâmetro path  
        2. Decompõe o parâmetro path em todas as pastas que são pecorridas.  
        3. Define o atributo FolderName como igual a ùltima pasta do path.
    ```

    ###### Exemplo
        Entrada: "uploads/users/Hermenegildo"

- GetFolderName: Um método público que devolve uma string.  

    ```
    1. Retorna atributo FolderName
    ```

- Create: Um método assícrono, púbico e que não possúi retorno  

    ```
    1. Verifica se a pasta existe
        1. Se existe, continue o fluxo
        2. Se não existe, imprime a mensagem de erro `A pasta ${this.path} já existe`
    2. ele espera o método mkdir, usado no js para executar criar pastas, com o parâmetro caminho como o caminho relativo até a pasta que queremos criar. É importante citar a configuração de ativação do comportamento recursivo, o que significa, que caso uma das pastas do caminho não exista ele criará, criando, portanto, todas as pastas em níveis acima da pasta desejada.
    3. Caso haja algum erro ele retorna o erro.
    ```

- pastaExiste: Um método assícrono, púbico e que possúi retorno booleano.

        1. O arquivo tenta esperar o método acess acessar a pasta com o path definido no construtor.
        2. Retorna verdadeiro.
        3. Se der erro ele retorna falso.

    ###### Exemplo
        Saída: False

- Delete: Um método assícrono, púbico e que não possúi retorno.

        1. Tenta esperar a pasta ser excluída.
        2. Caso dê erro ele retorna e imprime.

- Rename: Um método assícrono, púbico e que não possúi retorno.

        1. Exige um parâmetro de novoCaminho, que será o nome após renomear a pasta, se for mudar mais de uma pasta de nome, execute cada um a mão
        2. Espera a renomeação da pasta terminar
        3. Caso dê erro ele imprime o erro no terminal e retorna.

    ###### Exemplo
        Entrada:"uploads/users/Hermenegildo"
- listarArquivos: Um método assícrono, púbico e que retorna uma lista de strings.
        1. Espera a execução do método que retona a lista com o nome dos arquivos naquela pasta.
        2. Caso dê erro, ele retorna e imprime o erro.
    ###### Exemplo
        Saída: ["img.png","main.png"]
- FileExist: Um método assícrono, púbico e que retorna um booleano.

        1. Exige o arquivo desejado instanciado como uma classe archive, ou filha da classe archive.
        2. Define a variável name como igual ao nome do arquivo.
        3. Define a variável arquivos como o retorno do método listarArquivos.
        4. Verifica se o nome do arquivo está na váriavel arquivos.
        5. Caso tenha algum erro, ele retorna o erro e imprime.
    
    ###### Exemplo
        Entrada: new Archive("uploads/users/Hermenegildo","fotos.jpg")
        Saída: True
#### Class/TS/image.ts
Esse arquivo é responsável pela classe que lida com a manipulação de imagens, essa classes possui portanto alguns atributos e métodos para conseguir manipular as imagens que são guardadas.
##### herança
Essa classe herda todos os métodos e atributos de archive, portanto, tudo que não for comentado aqui, é igual a archive e não vale a pena a repetição desses métodos e atributos.
##### método
- Salvar: Um método público, assíncrono, estático e sem retorno
A principal diferença desse método para o original da classe pai, é que ele transforma a string em base64, utilizada como parâmetro para conteúdo, para um bínario.

        1. Esse método exige dois parâmetros, o caminho relativo para o arquivo, e o conteúdo em base64.
        2. O primeiro passo é retirar o prefíxo utilizado quando se transforma imagens em base64.
        3. Esperar a escrita do arquivo.
        4. Imprimir que o arquivo foi salvo com sucesso.
        5. Caso haja algum erro, eu imprimo e retorno ele.

- read: método assíncrono, público e com retorno em string.
A principal diferença é que a leitura de uma imagem retorna um binário, portanto, é preciso converter o conteúdo para base64.  

        1. Primeiro passo é ler o arquivo.
        2. Logo em seguida precisamos converter para base64.
        3. Para finalizar, apenas retorna o base64.
        4. Caso haja algum erro, o erro é imprimido e retornado.

    ##### Exemplo  
        Retorno: "ANGJWwanakoapehgtyaotg,aoj@#njkjkshnjoajwHO$J#%90"
### Class/compiled/
Essa pasta reserva todos os códigos em Typescript compilados para Javascript
## Controler/
Essa pasta é responsável por fazer toda a lógica das pastas
### Controler/ImageController.js
Esse arquivo é resposável pela classe que lida com a lógica de todas as rotas de imagem, sendo que cada método cuida de uma lógica de uma rota diferente.  
Essa Classe não possui construtor, pois os métodos são profundamente separados, não dependendo de nenhum estado da classe, sendo a classe, portanto, apenas para o agrupamento lógico dos métodos estáticos que funcionariam perfeitamente quando isolados um dos outros, ou fora da classe.
#### métodos 
- Separate: umo método estática com o retorno de um array de duas strings.  

    1. Esse método serve para a separação do caminho para o caminho da pasta a qual será guardada os arquivos e o nome do arquivo a ser armazenado.  
    2. A única entrada do método é o caminho relativo até o arquivo, partindo da pasta raiz do projeto.  
    3. Primeira esse método usa um split a partir do caractere '/', retornando, por consequência, toda a tragetória   descrita no caminho relativo usado de entrada.  
    4. Logo em seguida ela define o nome do arquivo como o último nível do caminho
    5. Logo em seguida ela pecorre cada uma das pasta e inclui na várivel que corresponde ao caminho da pasta para qual será guardada o arquivo.  
    6. retorna um array com a estrutura [name,DadFolderPath].  

Exemplo:  

    Entrada: `"uploads/users/Hermenegildo/fotos.jpg"`  
    Retorno: `["fotos.jpg","uploads/users/Hermenegildo"]`  

- Create: um método estática com o retorno de um json.
Esse método reprensenta a lógica da rota de criação/utualização de imagens.
    1. Embora a função só exija os parâmetros de requisição e resposta, exige também, para seu funcionamento interno, o envio dos parâmetros de base64, que represente o conteúdo da imagem, e path, que representa o caminho relativo até o arquivo.
    2. Primeiramente a função captura os parâmetros base64 e path do corpo da requisição JSON.
    3. Verifica se os atributos foram passados e não são nulos, caso seja nulo retorna um json com status 400.
    4. É feita a verificação dos tipos dos parâmetros, caso não correspondam ao esperado, ele retorna um json com status 400.
    5. Separa o nome do arquivo do caminho até a pasta, usando o método Separate.
    6. Valida se o nome do arquivo é válido, caso não retorna um json com status 400.
    7. Instancia a variável Folder, usando o parâmetro do caminho até a pasta, obtido na separação do path.
    8. Verifica se a pasta existe, caso não exista, a pasta é criada.
    9. Cria/Atuliza a foto, e retorna um json status 200.
    10. Caso dê algum erro, ele imprime o erro e retorna um json com status 501.
- Read: um método estática com o retorno de um json.
Esse método reprensenta a lógica da rota de leitura de imagens.
    1. Embora a função só exija os parâmetros de requisição e resposta, exige também, para seu funcionamento interno, o envio dos parâmetros de path, que representa o caminho relativo até o arquivo.
    2. Primeiramente o atributo path é desestruturado e atribuido a variável path.
    3. É feita uma verificação de se o atributo foi enviado, caso seja nulo, retorna um json com status 500.
    4. É feito o teste do tipo do atributo, caso não seja string, retorna um json com status 500.
    5. O atributo path é desestruturado entre caminho até a pasta que será armazenada e nome do arquivo
    6. Os objetos Folder e Image são instaciados.
    7. A rota checa o se a pasta e o arquivo existe, caso não exista, retorna um json com status 500.
    8. Retorna um json com o conteúdo do arquivo.
    9. Caso dê algum erro, retorna um json com status 500.
- Delete: um método estática com o retorno de um json.
Esse método reprensenta a lógica da rota de deletar uma imagem.
    1. Embora a função só exija os parâmetros de requisição e resposta, exige também, para seu funcionamento interno, o envio dos parâmetros de path, que representa o caminho relativo até o arquivo.
    2. Primeiramente o atributo path é desestruturado e atribuido a variável path.
    3. É feita uma verificação de se o atributo foi enviado, caso seja nulo, retorna um json com status 500.
    4. É feito o teste do tipo do atributo, caso não seja string, retorna um json com status 500.
    5. O atributo path é desestruturado entre caminho até a pasta que será armazenada e nome do arquivo
    6. Os objetos Folder e Image são instaciados.
    7. A rota checa o se a pasta e o arquivo existe, caso não exista, retorna um json com status 500.
    8. Deleta o arquivo.
    9. Retorna um json com status 200.
    10. Caso dê erro, a rota retorna um json com status 500.
## Routes/
Essa pasta lida com a atribuição da lógica das rotas para as devidas rota.
### Routes/
A primeira linha é a instanciação de um router, dentro desse router eu configuro algumas rotas.
- "/" com método post: associado ao método ImageController.Create, já relatado anteriormente
- "/" com método put: associado ao método ImageController.Read, já relatado anteriormente
- "/" com método delete: associado ao método ImageController.Delete, já relatado anteriormente

## app.js
Esse arquivo é o centralizador de rotas, ou seja, o arquivo base do servido, analizemos portanto suas configurações.

### express 
```js
const app = express();
```
A primeira linha realmente relevante instacia o midware do `express`, biblioteca essa que serva para a comunicação entre APIs no Javascript.  

### Cors
```js
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
``` 
Essa linha se refere a de onde iremos aceitar as requisições JSON

### Tipo de comunicação
```js
app.use(express.json({ limit: '1024mb' }));
```
Essa linha nos dá duas informações:  
    1. o tipo de comunicação, que nesse caso é JSON.  
    2. O tamanho máximo do JSON, que nesse caso é 1GB.
### Interpretação de formulários
```js
app.use(express.urlencoded({ extended: false }));
```
Essa linha configura a recepção de dados via json em rotas JSON para que as propiedades possam ser recuperadas no req.body
### Image routes
```
app.use('/images', ImagesRoutes);
```
Essa linha coloca o Router que corresponde as rotas de imagem para rodar na url 
/images
### Porta que roda o servidor
```js
const PORT = 3001;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
```
esse pedaço coloca o servidor para rodar na porta 3001