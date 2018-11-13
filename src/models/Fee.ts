// /* tslint:disable:variable-name */
import {
    Table,
    Column,
    Model,
    Default,
    UpdatedAt,
    CreatedAt,
  } from "sequelize-typescript";

  @Table({ tableName: "fees" })
  export class Fee extends Model<Fee> {
    @Column
    public name: string;

    @Default(0)
    @Column
    public rate: number;

    @Column
    public restrictions: string;

    @CreatedAt
    public createdAt: Date;

    @UpdatedAt
    public updatedAt: Date;

  }
