import Archive from "./archive.js";
import { readFile } from 'fs/promises';
import { writeFile } from 'fs/promises';
class Image extends Archive {
    static async salvar(path, content) {
        try {
            const base64Limpo = content.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Limpo, 'base64');
            await writeFile(path, buffer);
            console.log('Arquivo salvo com sucesso!');
        }
        catch (error) {
            throw error;
        }
    }
    constructor(path, name) {
        super(path, name);
    }
    async read() {
        try {
            const dados = await readFile(this.fullPath);
            const base64 = dados.toString('base64');
            return `data:image/png;base64,${base64}`;
        }
        catch (error) {
            throw error;
        }
    }
}
export default Image;
