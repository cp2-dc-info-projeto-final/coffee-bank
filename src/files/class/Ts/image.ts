import Archive from "./archive"
import { readFile } from 'fs/promises'
import { writeFile } from 'fs/promises';
class Image extends Archive{
    public static async salvar(path:string,content: string):Promise<void> {
        try {
            const base64Limpo = content.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Limpo, 'base64');
            await writeFile(path, buffer);
            console.log('Arquivo salvo com sucesso!');
        } catch (error) {
            throw error
        }
    }
    constructor(path:string,name:string){
        super(path,name)
    }
    public async read():Promise<string>{
        try {
            const dados = await readFile(this.fullPath);
            const base64 = dados.toString('base64');
            return base64;
        } catch (error) {
            throw error;
        }
    }
}
export default Image