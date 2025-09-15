import { access } from 'fs/promises';
import { constants } from 'fs';
import { mkdir } from 'fs/promises';
import { rmdir } from 'fs/promises';
import { rename } from 'fs/promises';
import { readdir } from 'fs/promises';
import Archive from './archive';
class Folder {
  private path: string;
  private FolderName: string;

  constructor(path: string) {
    this.path = path;
    const partes = path.split('/');
    this.FolderName = partes[partes.length - 1];
  }

  public GetfolderName(): string {
    return this.FolderName;
  }

  public async Create(): Promise<void> {
    if (!(await this.pastaExiste())) {
      try {
        await mkdir(this.path, { recursive: true });
      } catch (error) {
        throw error
      }
    }
    else{
      console.error(`A pasta ${this.path} já existe`);
    }
  }

  public async pastaExiste(): Promise<boolean> {
    try {
      await access(this.path, constants.F_OK);
      return true;
    } catch {
      return false;
    }
  }

  public async Delete(): Promise<void> {
    try {
      await rmdir(this.path);
    } catch (error) {
      console.error('Erro ao deletar diretório:', error);
      throw error
    }
  }

  public async Rename(novoCaminho: string): Promise<void> {
    try {
      await rename(this.path, novoCaminho);
      this.path = novoCaminho;
    } catch (error) {
      console.error('Erro ao renomear diretório:', error);
      throw error
    }
  }

  public async listarArquivos(): Promise<string[]> {
    try {
      return await readdir(this.path);
    } catch (error) {
      console.error('Erro ao listar arquivos:', error);
      throw error;
    }
  }

  public async FileExist(archive:Archive): Promise<boolean> {
    try{
      const name = archive.getNome();
      const arquivos = await this.listarArquivos();
      return arquivos.includes(name);
    }
    catch (error) {
      console.error('Erro ao buscar o arquivo:', error);
      throw error;
    }
  }
}

export default Folder