import { rules, schema } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class UserValidator {
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
      rules.minLength(3),
      rules.maxLength(30),
      rules.alpha({
        allow: ["space"],
      }),
    ]),
    email: schema.string({}, [
      rules.email({
        sanitize: true,
      }),
      rules.unique({
        table: "users",
        column: "email",
      }),
    ]),
    role: schema.enum(["owner", "user"]),
    password: schema.string({}, [
      rules.minLength(6),
      rules.maxLength(32),
      rules.confirmed(),
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
    "name.required": "Nama harus di isi!",
    "name.minLength": "Nama minimal 3 huruf",
    "name.maxLength": "Nama tidak boleh lebih dari 30 huruf",
    "name.alpha": "Nama tidak boleh mengandung simbol dan angka",
    "email.required": "Email harus di isi!",
    "email.email": "format email yang anda masukan salah",
    "email.unique": "email sudah terdaftar, silahkan coba email yang lain",
    "password.required": "Password harus di isi!",
    "password.minLength": "Password minimal 6 huruf",
    "password.maxLength": "Nama tidak boleh lebih dari 32 huruf",
    'role.required': 'Role harus diisi!',
  };
}
