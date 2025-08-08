// src/entity/Package.js
import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Package",
  tableName: "packages",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    trackingNumber: {
      type: "varchar",
      unique: true
    },
    sender: {
      type: "json", // Guarda el objeto completo
      nullable: false
    },
    recipient: {
      type: "json", // Guarda el objeto completo
      nullable: false
    },
    status: {
      type: "varchar",
      default: "pendiente"
    }
  }
});
