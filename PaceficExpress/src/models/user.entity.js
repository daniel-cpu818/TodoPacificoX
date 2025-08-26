import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Package } from "./package.entity.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id;

  @Column({ unique: true })
  email;

  @Column()
  password;

  @Column()
  name;

  @Column({
    type: "enum",
    enum: ["admin", "messenger"],
    default: "messenger",
  })
  role;

  @Column({ default: true })
  isActive;

  @CreateDateColumn()
  createdAt;

  @UpdateDateColumn()
  updatedAt;

  // Relación: un mensajero puede tener muchos paquetes asignados
  @OneToMany(() => Package, (pkg) => pkg.messenger)
  packages;
}
