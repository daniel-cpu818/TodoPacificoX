import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity.js";

@Entity()
export class Package {
  @PrimaryGeneratedColumn("uuid")
  id;

  @Column()
  trackingNumber;

  @Column()
  senderName;

  @Column()
  senderAddress;

  @Column()
  recipientName;

  @Column()
  recipientAddress;

  @Column({
    type: "enum",
    enum: ["pending", "in_transit", "delivered", "cancelled"],
    default: "pending",
  })
  status;

  // Relación: un paquete tiene un mensajero asignado (opcional)
  @ManyToOne(() => User, (user) => user.packages, { nullable: true })
  messenger;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;
}
