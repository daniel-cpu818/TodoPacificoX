import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    name: {
      type: "varchar"
    },
    email: {
      type: "varchar",
      unique: true
    },
    password: {
      type: "varchar"
    },
    role: {
      type: "varchar",
      default: "mensajero"
    }
  },
  relations: {
    packages: {
      type: "one-to-many",
      target: "Package",
      inverseSide: "assignedTo"
    }
  }
});
