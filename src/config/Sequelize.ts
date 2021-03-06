import { Sequelize } from "sequelize-typescript";
import fs from "fs-extra";
import appRoot from "app-root-path";

import Environment from "@env";
import { Fee } from "@models";

global.sequelize = new Sequelize({
  dialect: "mysql",
  host: Environment.db.host,
  port: Environment.db.port,
  database: Environment.db.database,
  username: Environment.db.user,
  password: Environment.db.password,
});

global.sequelize.addModels([
  Fee,
]);

export const sequelize = global.sequelize;

export async function throwMigrationError(): Promise<void> {
  const migrationFiles = await fs.readdir(`${appRoot}/src/db/migrations`);

  const dbMigrations = (await global.sequelize.query(
    `SELECT name as migration FROM SequelizeMeta`,
    { type: global.sequelize.QueryTypes.SELECT }
  )).map(row => row["migration"]);

  for (const migrationFile of migrationFiles) {
    if (dbMigrations.indexOf(`${migrationFile}`) === -1) {
      setTimeout(() => {
        throw new Error("Run all migrations!");
      });
    }
  }
}
