import Image from "../class/compiled/image.js"
import Folder from "../class/compiled/folder.js"
class ImageController{
    static Separate(path){
        let caminhos=path.split("/")
        let name=caminhos[caminhos.length-1]
        let DadFolderPath=""
        for (let x = 0; x < caminhos.length - 1; x++) {
            DadFolderPath+=caminhos[x];
        }
        return [name,DadFolderPath]
    }
    static async Create(req,res) {
        const {base64,path}=req.body
        let Separated=ImageController.Separate(path)
        let name=Separated[0]
        let DadFolderPath=Separated[1]
        let folder=new Folder(DadFolderPath)
        await folder.Create()
        await Image.salvar(path,base64)
        return res.json("Arquivo salvo com sucesso")
    }
    static async Read(req,res){
        var {path} = req.body
        console.log(path)
        let Separated=ImageController.Separate(path)
        let name=Separated[0]
        let DadFolderPath=Separated[1]
        console.log(name,DadFolderPath)
        let imagem=new Image("",DadFolderPath,name)
        return res.json(await imagem.read())
    }
    static async Delete(req,res){
        var {path} = req.body
        let Desestruturado=ImageController.Separate(path)
        let name=Desestruturado[0]
        let Dad=Desestruturado[1]
        let imagem=new Image("",Dad,name)
        await imagem.delete()
        return res.json("arquivo deletado com sucesso")
    }
}
export default ImageController