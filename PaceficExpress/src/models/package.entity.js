import { EntitySchema } from "typeorm";
export const Package = new EntitySchema({
  name: "Package",
  tableName: "packages",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    trackingNumber: {
      type: "varchar",
      unique: true,
      nullable: false,
    },
    status: {
      type: "enum",
      enum: ["pendiente", "asignado", "en_camino", "entregado"],
      default: "pendiente",
    },
    proofImage1: {
      type: "varchar",
      nullable: true,
    },
    proofImage2: {
      type: "varchar",
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      createDate: true,
    },
    updatedAt: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    messenger: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      nullable: true,
    },
  },
});
export default Package;