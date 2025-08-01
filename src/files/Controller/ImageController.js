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
        const {base64,path}=req.body
        const Separated=ImageController.Separate(path)
        const DadFolderPath=Separated[1]
        console.log(DadFolderPath)
        const folder=new Folder(DadFolderPath)
        await folder.Create()
        await Image.salvar(path,base64)
        return res.json("Arquivo salvo com sucesso")
    }
    static async Read(req,res){
        var {path} = req.body
        const Separated=ImageController.Separate(path)
        const name=Separated[0]
        const DadFolderPath=Separated[1]
        const imagem=new Image(DadFolderPath,name)
        return res.json(await imagem.read())
    }
    static async Delete(req,res){
        var {path} = req.body
        const Desestruturado=ImageController.Separate(path)
        const name=Desestruturado[0]
        const Dad=Desestruturado[1]
        const imagem=new Image(Dad,name)
        await imagem.delete()
        return res.json("arquivo deletado com sucesso")
    }
}
export default ImageController