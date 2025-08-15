import { writeFile } from 'fs/promises';
import { readFile } from 'fs/promises';
import { unlink } from 'fs/promises';
import Folder from "./folder.js";
class Archive {
    constructor(path, name) {
        this.path = path;
        this.name = name;
        this.fullPath = `${path}/${name}`;
    }
    static async salvar(path, content) {
        try {
            await writeFile(path, content, 'utf8');
            console.log('Arquivo salvo com sucesso!');
        }
        catch (error) {
            console.error('Erro ao salvar arquivo:', error);
            throw error;
        }
    }
    async read() {
        try {
            const dados = await readFile(this.fullPath, 'utf8');
            console.log('Conteúdo do arquivo:', dados);
            return dados;
        }
        catch (error) {
            console.error('Erro ao ler arquivo:', error);
            throw error;
        }
    }
    async delete() {
        try {
            await unlink(this.fullPath);
            console.log(`Arquivo deletado com sucesso!`);
        }
        catch (error) {
            console.error(`Erro ao deletar arquivo :`, error);
            throw error;
        }
    }
    getNome() {
        return this.name;
    }
    dadFolder() {
        return new Folder(this.path);
    }
}
export default Archive;
