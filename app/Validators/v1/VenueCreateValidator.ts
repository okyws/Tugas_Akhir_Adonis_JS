import { rules, schema } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class VenueCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({}, [
      rules.maxLength(50),
    ]),
    address: schema.string({}, [
      rules.maxLength(200),
    ]),
    phone: schema.string({}, [
      rules.mobile({
        /**
         * jika menggunakan strict maka harus menambahkan '+' sebelum kode negara  
         * contoh : +6281200000000
         * 
         * jika tida menambahkan '+' sebelum kode negara maka akan error
         * */
        locales: ['id-ID'],
        strict: true,
      }),
      rules.maxLength(15),
    ]),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    'name.required': 'Nama Venue harus diisi!',
    'name.maxLength': 'Nama Venue tidak boleh lebih dari 50 huruf',
    'address.required': 'Alamat harus diisi!',
    'address.maxLength': 'Alamat tidak boleh lebih dari 200',
    'phone.required': 'Telepon harus diisi!',
    'phone.mobile': 'Telepon harus format negara Indonesia!',
    'phone.maxLength': 'Telepon tidak boleh lebih dari 15 digit',
  };
}
