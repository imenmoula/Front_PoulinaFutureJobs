// import { v4 as uuidv4 } from 'uuid';

// export class Role {
//     id: string;
//   name: string;
//   normalizedName: string; 
//   concurrencyStamp: string | null; // Nullable
//   index?: number; // Ajouté pour l'affichage 
//   constructor(name: string, id?: string) {
//     this.id = id ?? uuidv4(); // Génère un GUID si l'id n'est pas fourni
//     this.name = name;
//     this.normalizedName = name.toUpperCase();
//   }
// }
import { v4 as uuidv4 } from 'uuid';

export class Role {
     id: string;
  name: string;
  normalizedName: string;     // Aligné avec le backend
  concurrencyStamp: string | null; // Nullable, aligné avec le backend
  constructor(
    name: string,
    id?: string,
    normalizedName?: string,
    concurrencyStamp?: string | null,
   
  ) {
    this.id = id ?? uuidv4(); // Génère un GUID si non fourni
    this.name = name;
    this.normalizedName = normalizedName ?? name.toUpperCase(); // Utilise la valeur fournie ou normalise
    this.concurrencyStamp = concurrencyStamp ?? null;
  }
}