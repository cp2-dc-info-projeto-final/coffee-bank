# Configurando e rodando o backend
## Endpoints da API
antes é de intríncica importância executar o comando de instalação das depêndencias do projetos executando o seguinte comando no prompt de comando.
```bash
npm install
```

Aqui uma breve documentação dos endpoints da API de usuários.Execute o comando abaixo, lembre-se de ter primeiro executado a API do backend.

```bash
npm start
```

O `nodemon` permite reiniciar automaticamente o servidor Node.js quando arquivos são alterados, sem precisar encerrar o processo e inicar novamente a cada alteração. Para executar utilizando o `nodemon` utilize o comando abaixo.

```bash
npm run dev
```
### POST /images
Guarda/atualiza uma imagem no servidor de arquivos
**Body:**
```json
{
	"base64":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMBAApXB1kAAAAASUVORK5CYII=",
	"path":"upload/foto.png"
}
```

**Resposta:**
```json
{
	"sucess":true,
	"message":"arquivo salvo com sucesso"
}
```

### PUT /images
Lê uma foto a partir de um path
**Body:**
```json
	{
		"sucess":true,
		"message":"Leitura realizada com sucesso",
		"data":await imagem.read()
	}
```
**Resposta:**
```json
{
	"sucess":true,
	"message":"Leitura realizada com sucesso",
	"data":"ajiengoake gajsofmaeognmakoeenklnamgkonaekognakoegmafea.agpaejngpaiengo.bjioprsmbkçs.v;aeç[á.c]"
}
```
### DELETE /images
Deleta uma foto a partir de um path
```json
{
	"path":"uploads/foto.png"
}
```
**Resposta:**
```json
{
	"sucess":true,
	"message":"deleção feita com sucesso"
}
```
# Como utilizar esse servidor
## Configurações prévias
Precisamos entender algumas configurações prévias necessárias para que o servidor seja utilizado
- Limite de tamanho de JSON.  
Temos que primeiro configurar um tamanho grande para o Json, pois as imagens são textos imensos que precisam de tamanhos colossais para ser transportadas. Isso é feito adicionando um parâmetro de tamanho máximo para a chamada do midware de JSON(lugar do código que você fala que vai usar JSON na API), portanto alteramos o codigo de:
```javascript
app.use(express.json());
```
para:
```javascript
app.use(express.json({ limit: '1024mb' }));
```
Sendo que o `1024mb(1gb)` significa o tamanho máximo aceito para um JSON
- Core
Dentro do servidor precisamos endicar de onde vem a comunicação JSON, se não ela será recusada, fazemos isso com a linha de código
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));
```
Perceba que usei 3000, pois pretendo fazer a comunicação entre backends, sendo o servidor da minha API mandando as requisições de arquivo, portanto, se quiser alterar a origem, precisará mudar o numero para a porta pela qual quer enviar a requisição.
- Axios
é recomendado a utilização do `Axios` para a comunicação API, portanto execute o seguinte comando no prompt, dentro da pasta do backend.
```bash
npm install axios
```
precisaremos agora instanciar o axios com o código, logo após a instanciação do express.
```js
const axios = require('axios');
```

## Como enviar uma imagem
primeiro comecemos no frontend, precisamos portanto, de um input capaz de receber imagens, esse imput é o file, como no código a seguir:
```HTML
<input id="dropzone-file" type="file"/>
```
Precisamos, no entanto pegar esse valor, e processar  ele, para que vire um base64(um tipo de código string que uso como padrão para a recepção imagem nessa API) isso pode ser feito de uma forma simples, premeiro pegamos o arquivo, no entanto, esse tipo de input retorna não o arquivo, mas uma lista de arquivos, nós pegaremos portanto apenas o primeiro arquivo
```javascript
document.getElementById("dropzone-file").files[0]
```
porém esse é um objeto de bináro(isso se dá pois as imagens são arquivos binários e não arquivos de texto), e não um base64, precisamos portanto converter ele para tal formato foi fornecer a seguir uma pequena função em typescript que faça isso
```typescript
function fileConvertBase64(blob: Blob[]): Promise<string> {
	if (blob.length === 0) {
		return Promise.resolve("");
	}
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob[0]);
	});
}
```
perceba no entanto, que essa função espera uma lista de Blobs(Classe binária do js) e não um Blob específico, Portanto precisamos fazer uma pequena mudança na captura do arquivo, mudando para:
```javascript
document.getElementById("dropzone-file").files
```
Quando utilizada a função acima fica, portanto.
```typescript
await fileConvertBase64(document.getElementById("dropzone-file").files)
```
Essa função retorna o base64 que será enviado para o backendo, portanto um exemplo de JSON válido seria.
```js
{
	file: await fileConvertBase64(document.getElementById("dropzone-file").files),
	Senha5: document.getElementById("pin5").value,
	Senha7: document.getElementById("pin7").value,
	Nome: document.getElementById("nome").value,
	CPF: document.getElementById("cpf").value,
	Senha7conf:document.getElementById("pin7-confirm").value,
	Senha5conf:document.getElementById("pin5-confirm").value,
	Sex: sexo
};
```
A partir daqui lidaremos portanto com o backend.  
Tendo recebido o arquivo via JSON do front(e configurado um tamnho grande de JSON para ser recepcionado), capturamos esse atributo com o comando:
```js
const {file}=req.body
```
depois de recepcionado em base64 podemos agora, portanto enviar o Base64 utilizando o axios, com o comando
```js
const response = await axios.post('http://localhost:3001/images', 
{
	"base64":file,
	"path":"upload/foto.png"
}, {
	headers: {
	'Content-Type': 'application/json'
	}
});
```
Você, no entanto deve criar o seu padrão de caminho para que as imagens sejam guardadas.  
Nas rotas onde só exige o path, não é necessário o envio do Base64, apenas o caminho ao qual você quer usar.
## Como receber uma imagem
Primeiramente recebemos temos uma tag `<img>` que precisará receber essa imagem do servidor ficando portanto
```svelte
<img src={await User.Takeimage()}/>
```
Sendo que no meu caso `User.TakeImage` é um método da função User, que é montado com a resposta na recepção da resposta da consulta de usuário. Portanto, o método `User.TakeImage` portanto, fica com o seguinte codigo.
```ts
public async Takeimage():Blob{
	return await (await fetch(this.image)).blob();
}
```
dado isso, vamos ao backend, na minha rota `PUT /users/Login` eu recebo o login e CPF do usuário, a partir disso consulto no banco de dados. Com essa informação posso consultar os dados do usuário, obtendo o nome dele monto a url com a seguinte lógica
```url
uploads/NomeDoUsuárioSemEspaço/user.png
```
mando portanto essa URL para o servidor de arquivos com o comando
```js
const img = await axios.put('http://localhost:3001/images', 
{
	"path":"uploads/NomeDoUsuárioSemEspaço/user.png"
}, {
	headers: {
	'Content-Type': 'application/json'
	}
});
```
esse img portanto, é o base64 que representa, portanto a imagem do usuário. Agora apenas necessito de enviar isso para o frontend para ele recepcionar e instanciar a classe User. O json fica portanto.
```json
{"base64":img,
//todas as outras propiedades
}
```