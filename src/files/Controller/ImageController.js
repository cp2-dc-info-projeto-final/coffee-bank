import Image from "../class/compiled/image.js"
import Folder from "../class/compiled/folder.js"
class ImageController{
    static Separate(path){
        let caminhos=path.split("/")
        let name=caminhos[caminhos.length-1]
        let DadFolderPath=""
        for (let x = 0; x < caminhos.length - 1; x++) {
            if(DadFolderPath){
                DadFolderPath+=`/${caminhos[x]}`;
            }
            else{
                DadFolderPath+=caminhos[x];
            }
        }
        return [name,DadFolderPath]
    }
    static async Create(req,res) {
        try{
            const {base64,path}=req.body
            if(!base64||!path){
                return res.status(400).json({
                    "sucess":false,
                    "message":"Parâmetros vazios"}
                )
            }
            if(typeof(base64)!="string"||typeof(path)!="string"){
                return res.status(400).json({
                    "sucess":false,
                    "message":"Parâmetros inválidos"}
                )
            }
            const Separated=ImageController.Separate(path)
            const Arquivo_separado=Separated[0].split(".")
            if(Arquivo_separado.length!=2||Arquivo_separado[1]==="."){
                return res.status(400).json({
                    "sucess":false,
                    "message":"Nome de arquivo inválido"
                })
            }
            const DadFolderPath=Separated[1]
            const folder=new Folder(DadFolderPath)
            if(! await folder.pastaExiste()){
                await folder.Create()
            }
            await Image.salvar(path,base64)
            return res.status(200).json({
                "sucess":true,
                "message":"arquivo salvo com sucesso"
            })
        }catch(error){
            console.error(error)
            return res.status(501).json({
                "sucess":false,
                "message":"Erro interno do servidor"
            })
        }
    }
    static async Read(req,res){
        try{
            var {path} = req.body
            if(!path){
                return res.status(400).json({
                    "sucess":false,
                    "message":"Parâmetros vazios"
                })
            }
            if(typeof(path)!="string"){
                return res.status(400).json({
                    "sucess":false,
                    "message":"Parâmetros inválidos"}
                )
            }
            const Separated=ImageController.Separate(path)
            const name=Separated[0]
            const DadFolderPath=new Folder(Separated[1])
            const imagem=new Image(Separated[1],name)
            if(! await DadFolderPath.pastaExiste() || ! await DadFolderPath.FileExist(imagem)){
                return res.status(400).json({
                    "sucess":false,
                    "message":"Arquivo inexistente"
                })
            }
            return res.status(200).json({
                "sucess":true,
                "message":"Leitura realizada com sucesso",
                "data":await imagem.read()
            })
        }
        catch(error){
            console.error(error)
            return res.status(501).json({
                "sucess":false,
                "message":"Erro interno do servidor"
            })
        }
    }
    static async Delete(req,res){
        var {path} = req.body
        if(!path){
            return res.status(400).json({
                "sucess":false,
                "message":"Parâmetros vazios"
            })   
        }
        if(typeof(path)!="string"){
            return res.status(400).json({
                "sucess":false,
                "message":"Parâmetros inválidos"
            })
        }
        const Separated=ImageController.Separate(path)
        const name=Separated[0]
        const Dad=Separated[1]
        const imagem=new Image(Dad,name)
        try{
            const DadFolderPath=new Folder(Separated[1])
            if(! await DadFolderPath.pastaExiste() || ! await DadFolderPath.FileExist(imagem)){
                return res.status(400).json({
                    "sucess":false,
                    "message":"Arquivo inexistente"
                })
            }
            await imagem.delete()
            if((await DadFolderPath.listarArquivos()).length==0){
                DadFolderPath.Delete()
            }
            return res.status(200).json({
                "sucess":true,
                "message":"deleção feita com sucesso"
            })
        }catch(error){
            console.error(error)
            return res.status(501).json({
                "sucess":false,
                "message":"Erro interno do servidor"
            })
        }
    }
}
export default ImageController