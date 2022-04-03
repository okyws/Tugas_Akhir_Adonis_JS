import { DateTime } from "luxon";
import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Venue from "App/Models/Venue";
import Booking from "App/Models/Booking";

export default class Field extends BaseModel {
/**
 * @swagger
 * components:
 *    schemas:
 *      Field:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *          type:
 *            type: string
 *          venue_id:
 *            type: number
 *        required:
 *          - name
 *          - type
 *          - venue_id
 */
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public type: string;

  @column({ serializeAs: null })
  public venue_id: number;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  @belongsTo(() => Venue, {
    foreignKey: "venue_id",
  })
  public venues: BelongsTo<typeof Venue>;

  @hasMany(() => Booking)
  public bookings: HasMany<typeof Booking>;
}
