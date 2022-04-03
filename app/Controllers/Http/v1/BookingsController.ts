import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import BookingCreateValidator from "App/Validators/v1/BookingCreateValidator";
import Booking from "App/Models/Booking";
import Field from "App/Models/Field";
import Database from "@ioc:Adonis/Lucid/Database";
import User from "App/Models/User";

export default class BookingsController {
  public async index({ response, params }: HttpContextContract) {
    try {
      let id = params.field_id;
      let field = await Field.findByOrFail("id", id);
      if (field) {
        const field = await Field.query()
          .where("id", id)
          .preload("bookings", (bookingQuery) => {
            bookingQuery.withCount("players");
          })
          .firstOrFail();
        return response.status(200).json({
          status: "success",
          message: "Berhasil ambil data booking berdasarkan fields!",
          data: field,
        });
      }
    } catch (error) {
      response.badRequest({
        status: "failed",
        message: "Gagal memuat data Booking, lapangan tidak ditemukan!",
        erorrs: error.message,
      });
    }
  }

  public async store({ request, response, params, auth }: HttpContextContract) {
    let payload = await request.validate(BookingCreateValidator);
    try {
      let id: number = parseInt(params.field_id);
      let field = await Field.findByOrFail("id", id);
      let user = auth.user!;
      if (field) {
        let booking = new Booking();
        booking.fieldId = request.input("field_id", id);
        booking.userId = request.input("user_id", user.id);
        booking.date_booking = payload.date_booking;
        booking.time_start = payload.time_start;
        booking.time_end = payload.time_end;

        user.related("schedules").save(booking);

        response.created({
          status: "success",
          message: "berhasil menambahkan data booking baru",
          data: booking,
        });
      }
    } catch (error) {
      response.notFound({
        status: "failed",
        message: "gagal membuat Booking, lapangan tidak ditemukan!",
        erorrs: error.message,
      });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      let id = params.id;
      let field_id = params.field_id;

      let field = await Field.findByOrFail("id", id);

      if (field) {
        const booking = await Booking.query()
          .where("id", params.id)
          .andWhere("field_id", field_id)
          .preload("fields")
          .preload("players")
          .withCount("players")
          .firstOrFail();

        response.ok({
          status: "success",
          message: "menampilkan data booking berdasarkan id",
          data: booking,
        });
      }
    } catch (error) {
      response.notFound({
        status: "failed",
        message: "Booking tidak ditemukan!",
        erorrs: error.message,
      });
    }
  }

  public async update({
    request,
    response,
    params,
    auth,
  }: HttpContextContract) {
    await request.validate(BookingCreateValidator);
    try {
      let id = params.id;
      let field_id = params.field_id;

      let booking = await Booking.query()
        .where("id", id)
        .andWhere("field_id", field_id)
        .select("*")
        .firstOrFail();

      await booking
        .merge({
          fieldId: request.input("field_id", parseInt(params.field_id)),
          userId: request.input("user_id", auth.user?.id),
          date_booking: request.input("date_booking"),
          time_start: request.input("time_start"),
          time_end: request.input("time_end"),
        })
        .save();
      response.ok({
        status: "success",
        message: "data booking berhasil di update!",
        data: booking,
      });
    } catch (error) {
      response.notFound({
        status: "failed",
        message: "data tidak ditemukan!",
        error: error.message,
      });
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      let id = params.id;
      let field_id = params.field_id;

      let booking = await Booking.query()
        .where("id", id)
        .andWhere("field_id", field_id)
        .firstOrFail();

      await booking.delete();
      response
        .status(200)
        .json({ status: "success", message: "Booking berhasil di hapus!" });
    } catch (error) {
      response.notFound({
        status: "failed",
        message: "data tidak ditemukan!",
        erorrs: error.message,
      });
    }
  }

  public async all({ request, response }: HttpContextContract) {
    try {
      const field = await Booking.all();
      response.ok({
        status: "success",
        message: "ambil semua data booking",
        data: field,
      });

      if (request.qs().id) {
        const id = request.qs().id;

        const field = await Booking.query()
          .where("id", id)
          .preload("players")
          .withCount("players");

        response.status(200).json({
          status: "success",
          message: "filter data booking berdasarkan id Booking",
          filter: field,
        });
      }
    } catch (error) {
      response.notFound({
        status: "failed",
        message: "data tidak ditemukan!",
        erorrs: error.message,
      });
    }
  }

  public async join({ response, auth, params }: HttpContextContract) {
    try {
      const booking = await Booking.findOrFail(params.id);
      let user = auth.user!;

      const checkJoin = await Database.from("schedules")
        .where("booking_id", params.id)
        .where("user_id", user.id)
        .first();
      if (!checkJoin) {
        await booking.related("players").attach([user.id]);
        return response.created({
          status: "success",
          message: "berhasil join booking",
        });
      } else {
        await booking.related("players").detach([user.id]);
      }
      response.created({
        status: "success",
        message: "berhasil unjoin booking",
      });
    } catch (error) {
      response.notFound({
        status: "failed",
        message: "data tidak ditemukan!",
        erorrs: error.message,
      });
    }
  }

  public async schedules({ response, auth }: HttpContextContract) {
    try {
      let user = auth.user!;
      const data = await User.query()
        .preload("schedules", (qUser) => {
          qUser.withCount("players");
        })
        .where("id", user.id);

      response.status(200).json({
        status: "success",
        message: "data jadwal main untuk user yang sedang login",
        data: data,
      });
    } catch (error) {
      response.notFound({
        status: "failed",
        message: "data tidak ditemukan!",
        erorrs: error.message,
      });
    }
  }
}
