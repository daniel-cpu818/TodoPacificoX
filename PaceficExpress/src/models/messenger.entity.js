// // src/models/messenger.entity.js
// import { EntitySchema } from "typeorm";

// export default new EntitySchema({
//   name: "Messenger",
//   tableName: "messengers",
//   columns: {
//     id: {
//       primary: true,
//       type: "int",
//       generated: true
//     },
//     name: {
//       type: "varchar"
//     },
//     email: {
//       type: "varchar",
//       unique: true
//     },
//     password: {
//       type: "varchar"
//     }
//   },
//   relations: {
//     packages: {
//       type: "one-to-many",
//       target: "Package",
//       inverseSide: "messenger"
//     }
//   }
// });
