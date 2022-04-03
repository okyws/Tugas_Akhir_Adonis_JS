import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserValidator from "App/Validators/v1/UserValidator";
import User from "App/Models/User";
import { schema } from "@ioc:Adonis/Core/Validator";
import Mail from "@ioc:Adonis/Addons/Mail";
import Database from "@ioc:Adonis/Lucid/Database";

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const data = await request.validate(UserValidator);
    try {
      const newUser = await User.create({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      let otp_code: number = Math.floor(100000 + Math.random() * 90000);
      await Database.table("otp_codes").insert({
        otp_code: otp_code,
        user_id: newUser.id,
      });

      await Mail.send((message) => {
        message
          .from("oky@adonis.com")
          .to(data.email)
          .subject("Welcome to Booking API")
          .htmlView("mail/otp_verification", {
            name: data.name,
            otp_code: otp_code,
          });
      });

      response.created({
        status: "success",
        message:
          "Silahkan lakukan verifikasi kode OTP yang dikirimkan ke email anda!",
        data: newUser,
      });
    } catch (error) {
      response.unprocessableEntity({ messages: error.message });
    }
  }

  public async login({ request, response, auth }: HttpContextContract) {
    try {
      const loginSchema = schema.create({
        email: schema.string({ trim: true }),
        password: schema.string({ trim: true }),
      });
      const payload = await request.validate({ schema: loginSchema });

      const token = await auth
        .use("api")
        .attempt(payload.email, payload.password);

      return response.ok({ message: "Login Berhasil", data: token });
    } catch (error) {
      if (error.guard) {
        return response.unprocessableEntity({
          messages: "Login gagal!",
          error: error.message,
        });
      } else {
        return response.unprocessableEntity({
          messages: "Login gagal!",
          error: error.messages,
        });
      }
    }
  }

  public async otp_verification({ request, response }: HttpContextContract) {
    const otp_code = request.input("otp_code");
    const email = request.input("email");

    const user = await User.findByOrFail("email", email);

    const dataOtp = await Database.from("otp_codes")
      .where("otp_code", otp_code)
      .firstOrFail();

    if (user.id == dataOtp.user_id) {
      user.isVerified = true;
      await user.save();
      return response.ok({ status: "success", message: "Verifikasi Berhasil" });
    } else {
      return response.badRequest({
        messages: "verifikasi OTP gagal!",
      });
    }
  }
}
