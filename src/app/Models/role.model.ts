import { v4 as uuidv4 } from 'uuid';

export class Role {
    id: string;
  name: string;
  normalizedName: string;  
  constructor(name: string, id?: string) {
    this.id = id ?? uuidv4(); // Génère un GUID si l'id n'est pas fourni
    this.name = name;
    this.normalizedName = name.toUpperCase();
  }
}
