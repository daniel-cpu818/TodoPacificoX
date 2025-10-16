import { EntitySchema } from "typeorm";

export const PackageHistory = new EntitySchema({
  name: "PackageHistory",
  tableName: "package_history",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    previousStatus: {
      type: "enum",
      enum: [
        "pendiente",
        "asignado_ruta",
        "en_ruta_bventura",
        "recibido_bventura",
        "asignado_reparto",
        "en_reparto",
        "entregado",
      ],
      nullable: false,
    },
    newStatus: {
      type: "enum",
      enum: [
        "pendiente",
        "asignado_ruta",
        "en_ruta_bventura",
        "recibido_bventura",
        "asignado_reparto",
        "en_reparto",
        "entregado",
      ],
      nullable: false,
    },
    note: {
      type: "text",
      nullable: true,
    },
    changedAt: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    package: {
      type: "many-to-one",
      target: "Package",
      joinColumn: true,
      onDelete: "CASCADE",
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      nullable: true,
    },
  },
});
export default PackageHistory;
