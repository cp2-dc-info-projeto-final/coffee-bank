class User {
  public CPF: string;
  public Nome: string;
  public Imagem: string | null;
  public Sex: boolean;
  public constructor(data: { CPF?: string; Nome?: string; Imagem?: string | null; sex?: boolean }) {
    this.CPF = data.CPF ?? '';
    this.Nome = data.Nome ?? '';
    this.Imagem = data.Imagem ?? null;
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
  public GetImagem(): string | null {
    return this.Imagem;
  }
  public GetSex(): boolean {
    return this.Sex;
  }
}
export default User;