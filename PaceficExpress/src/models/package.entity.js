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
    sender: {
    type: "jsonb",
    nullable: true,
    },
    recipient: {
      type: "jsonb",
      nullable: true,
    },
    status: {
      type: "enum",
      enum: ["pendiente", "en_ruta_bventura", "recibido_bventura", "asignado_reparto", "en_reparto", "entregado"],
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
    hasIncident: {
      type: "boolean",
      default: false,
    },
    incident: {
      type: "jsonb",
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
   history: {
  type: "one-to-many",
  target: "PackageHistory",
  inverseSide: "package",
  cascade: true,},
  },
});
export default Package;