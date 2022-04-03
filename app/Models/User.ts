import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
} from "@ioc:Adonis/Lucid/Orm";
import Booking from "App/Models/Booking";
/**
 * @swagger
 * components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *          email:
 *            type: string
 *          password:
 *            type: string
 *          isverified:
 *            type: boolean
 *          role:
 *            type: string
 *          rememberMeToken:
 *            type: string
 *        required:
 *          - name
 *          - email
 *          - password
 *          - role
 */
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column({ serializeAs: null })
  public isVerified: boolean;

  @column({ serializeAs: null })
  public role: string;

  @column({ serializeAs: null })
  public rememberMeToken?: string;

  @column.dateTime({ autoCreate: true, serializeAs: null })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @hasMany(() => Booking)
  public schedules: HasMany<typeof Booking>;
}
