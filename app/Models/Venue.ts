import { DateTime } from "luxon";
import { BaseModel, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Field from "./Field";

export default class Venue extends BaseModel {
/**
 * @swagger
 * components:
 *    schemas:
 *      Venue:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *          address:
 *            type: string
 *          phone:
 *            type: string
 *        required:
 *          - name
 *          - address
 *          - phone
 */
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public address: string;

  @column()
  public phone: string;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  @hasMany(() => Field, {
    foreignKey: "venue_id",
  })
  public fields: HasMany<typeof Field>;
}
