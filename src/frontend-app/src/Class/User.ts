class User {
  public CPF: string;
  public Nome: string;
  public Imagem: string | null;
  public Sex: boolean;
  private static base64ToBlob(base64String:any):Blob {
    // Separa o tipo MIME e os dados base64
    const [header, base64Data] = base64String.split(',');
    const contentType = header.match(/data:(.*);base64/)[1];
  
    // Converte Base64 em dados binários
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
  
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    return new Blob(byteArrays, { type: contentType });
  }
  public constructor(data: { CPF?: string; Nome?: string; Imagem?: string | null; sex?: boolean }) {
    this.CPF = data.CPF ?? '';
    this.Nome = data.Nome ?? '';
    this.Imagem = data.Imagem ?? null;
    console.log(this.Imagem)
    this.Sex = data.sex ?? false;
  }
  public Getlist():[string, string, string | null, boolean] {
    return [
      this.CPF,
      this.Nome,
      this.Imagem,
      this.Sex 
    ]
  }
  public GetCPF(): string {
    return this.CPF;
  } 
  public GetNome(): string {
    return this.Nome;
  } 
  public GetSex(): boolean {
    return this.Sex;
  }
  public GetImagem(): Blob | null {
    return this.Imagem
  }
}
export default User;