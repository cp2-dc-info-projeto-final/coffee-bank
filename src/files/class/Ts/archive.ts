import { writeFile } from 'fs/promises';
import { readFile } from 'fs/promises'
import { unlink } from 'fs/promises';
import Folder from "./folder";
class Archive{
    public path:string;
    public name:string;
    public fullPath:string;
    constructor(path:string,name:string){
        this.path=path
        this.name=name
        this.fullPath=`${path}/${name}`
    }
    public static async salvar(path:string,content: string):Promise<void> {
        try {
            await writeFile(path, content, 'utf8');
            console.log('Arquivo salvo com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar arquivo:', error);
            throw error
        }
    }
    public async read():Promise<string>{
        try {
            const dados = await readFile(this.fullPath, 'utf8');
            console.log('Conteúdo do arquivo:', dados);
            return dados;
        } catch (error) {
            console.error('Erro ao ler arquivo:', error);
            throw error;
        }
    }
    public async delete():Promise<void>{
        try {
            await unlink(this.fullPath);
            console.log(`Arquivo deletado com sucesso!`);
        } catch (error) {
            console.error(`Erro ao deletar arquivo :`, error);
            throw error
        }
    }
    public getNome():string{
        return this.name
    }
    public dadFolder():Folder{
        return new Folder(this.path)
    }
}
export default Archive