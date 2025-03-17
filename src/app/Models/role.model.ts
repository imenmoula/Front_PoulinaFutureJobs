export class Role {
    id: string;
  name: string;
  normalizedName: string;  
  constructor(name: string, id?: string) {
    this.id = id ?? self.crypto.randomUUID();
    this.name = name;
    this.normalizedName = name.toUpperCase();
  }
}
