import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import VenueCreateValidator from "App/Validators/v1/VenueCreateValidator";

import Venue from "App/Models/Venue";

export default class VenuesController {
  public async index({ request, response }: HttpContextContract) {
    try {
      let venue = await Venue.all();
      if (venue) {
        response.status(200).json({
          message: "Berhasil mengambil semua data venue",
          data: venue,
        });

        if (request.qs().name) {
          let name = request.qs().name;

          let venueFiltered = await Venue.findBy("name", name);
          response.status(200).json({
            status: "success",
            message: "filter data venue berdasarkan nama",
            data: venueFiltered,
          });
        }
      }
    } catch (error) {
      response.notFound({
        status: "failed",
        message: "Gagal memuat data Venue",
        erorrs: error.message,
      });
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(VenueCreateValidator);
    try {
      const newVenue = await Venue.create({
        name: payload.name,
        address: payload.address,
        phone: payload.phone,
      });

      response.created({
        status: "success",
        message: "Venue berhasil dibuat!",
        data: newVenue,
      });
    } catch (error) {
      response.unprocessableEntity({
        status: "failed",
        message: "gagal membuat Venue!",
        erorrs: error.messages,
      });
    }
  }

  public async show({ response, params, request }: HttpContextContract) {
    try {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();

      const venue = await Venue.findByOrFail("id", params.id);
      if (venue) {
        const field = await Venue.query()
          .where("id", params.id)
          .preload("fields", (qField) => {
            qField
              .where("venue_id", params.id)
              .preload("bookings", (qBooking) => {
                qBooking.where("date_booking", date).withCount("players");
              });
          });

        response.status(200).json({
          status: "success",
          message: "berhasil get data venue by id",
          data: field,
        });
      }

      if (request.qs().type) {
        const type = request.qs().type;

        const field = await Venue.query()
          .preload("fields", (qField) => {
            qField
              .where("venue_id", params.id)
              .andWhere("type", type)
              .preload("bookings", (qBooking) => {
                qBooking.where("date_booking", date).withCount("players");
              });
          })
          .where("id", params.id);

        response.status(200).json({
          status: "success",
          message: "filter data berdasarkan type",
          filter: field,
        });
      }
    } catch (error) {
      response.notFound({
        status: "failed",
        message: "data tidak ditemukan!",
        error: error.message,
      });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    await request.validate(VenueCreateValidator);
    try {
      let id = params.id;
      let update = await Venue.findByOrFail("id", id);

      await update
        .merge({
          name: request.input("name"),
          address: request.input("address"),
          phone: request.input("phone"),
        })
        .save();

      response.ok({
        status: "success",
        message: "data berhasil di update!",
        data: update,
      });
    } catch (error) {
      response.notFound({
        status: "failed",
        message: "data tidak ditemukan!",
        erorrs: error.message,
      });
    }
  }

  public async destroy({ response, params }: HttpContextContract) {
    try {
      let id = params.id;
      let venue = await Venue.findByOrFail("id", id);
      await venue.delete();
      response.ok({
        status: "success",
        message: "data Venue berhasil di hapus!",
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
