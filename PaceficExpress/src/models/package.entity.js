import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Package",
  tableName: "packages",
  columns: {
    id: {
      primary: true,
      type: "uuid",
      generated: "uuid"
    },
    trackingNumber: {
      type: "varchar",
      unique: true
    },
    description: {
      type: "varchar"
    },
    status: {
      type: "varchar",
      default: "pendiente"
    }
  },
  relations: {
    assignedTo: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      nullable: true
    }
  }
});
