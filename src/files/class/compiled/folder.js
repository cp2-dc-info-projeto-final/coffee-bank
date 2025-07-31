import { access } from 'fs/promises';
import { constants } from 'fs';
import { mkdir } from 'fs/promises';
import { rmdir } from 'fs/promises';
import { rename } from 'fs/promises';
import { readdir } from 'fs/promises';
class Folder {
    constructor(path) {
        this.path = path;
        const partes = path.split('/');
        this.FolderName = partes[partes.length - 1];
    }
    GetfolderName() {
        return this.FolderName;
    }
    async Create() {
        if (!(await this.pastaExiste())) {
            try {
                await mkdir(this.path, { recursive: true });
            }
            catch (error) {
                console.error('Erro ao criar pasta:', error);
            }
        }
    }
    async pastaExiste() {
        try {
            await access(this.path, constants.F_OK);
            return true;
        }
        catch {
            return false;
        }
    }
    async Delete() {
        try {
            await rmdir(this.path);
        }
        catch (error) {
            console.error('Erro ao deletar diretório:', error);
        }
    }
    async Rename(novoCaminho) {
        try {
            await rename(this.path, novoCaminho);
            this.path = novoCaminho;
        }
        catch (error) {
            console.error('Erro ao renomear diretório:', error);
        }
    }
    async listarArquivos() {
        try {
            return await readdir(this.path);
        }
        catch (error) {
            console.error('Erro ao listar arquivos:', error);
            return [];
        }
    }
    async FileExist(archive) {
        const name = archive.getNome();
        const arquivos = await this.listarArquivos();
        return arquivos.includes(name);
    }
}
export default Folder;
