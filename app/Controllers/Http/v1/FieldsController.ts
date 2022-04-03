import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import FieldCreateValidator from "App/Validators/v1/FieldCreateValidator";

import Field from "App/Models/Field";
import Venue from "App/Models/Venue";

export default class FieldsController {
  public async index({ request, response, params }: HttpContextContract) {
    try {
      let venue_id = params.venue_id;
      let venue = await Venue.findByOrFail("id", venue_id);
      if (venue) {
        const field = await Venue.query()
          .preload("fields")
          .where("id", venue_id)
          .firstOrFail();
        response.status(200).json({
          status: "success",
          message: "Berhasil mengambil semua data Lapangan yang ada di venue",
          data: field,
        });
      }
      if (request.qs().type) {
        const type = request.qs().type;

        const field = await Venue.query()
          .preload("fields", (qField) => {
            qField.where("venue_id", venue_id).andWhere("type", type);
          })
          .where("id", venue_id);

        response.status(200).json({
          status: "success",
          message: "filter data berdasarkan type",
          filter: field,
        });
      }
    } catch (error) {
      response.badRequest({
        status: "failed",
        message: "gagal memuat data Arena, Arena tidak ditemukan!",
        erorrs: error.message,
      });
    }
  }

  public async store({ request, response, params }: HttpContextContract) {
    await request.validate(FieldCreateValidator);
    try {
      let id = params.venue_id;
      let venue = await Venue.findByOrFail("id", id);
      if (venue) {
        let field = new Field();
        field.name = request.input("name");
        field.type = request.input("type");
        field.venue_id = request.input("venue_id", id);
        await field.related("venues").associate(venue);

        response.created({
          status: "success",
          message: "berhasil menambahkan data field baru",
          data: field,
        });
      }
    } catch (error) {
      response.unprocessableEntity({
        status: "failed",
        message: "gagal membuat Arena!",
        erorrs: error.message,
      });
    }
  }

  public async show({ response, params }: HttpContextContract) {
    try {
      let id = params.id;
      let venue = await Venue.findByOrFail("id", params.venue_id);
      if (venue) {
        const field = await Field.query()
          .where("id", id)
          .andWhere("venue_id", params.venue_id)
          .preload("venues")
          .preload("bookings", (bookingQuery) => {
            bookingQuery.withCount("players").preload("players");
          })
          .firstOrFail();
        return response.status(200).json({
          status: "success",
          message: "Berhasil ambil data Arena berdasarkan id!",
          data: field,
        });
      }
    } catch (error) {
      response.notFound({
        status: "failed",
        message: "Arena tidak ditemukan!",
        erorrs: error.message,
      });
    }
  }

  public async update({ request, response, params }: HttpContextContract) {
    await request.validate(FieldCreateValidator);
    try {
      let id = params.id;
      let venue_id = params.venue_id;

      let field = await Field.query()
        .where("id", id)
        .andWhere("venue_id", venue_id)
        .select("*")
        .firstOrFail();

      await field
        .merge({
          name: request.input("name"),
          type: request.input("type"),
          venue_id: request.input("venue_id", venue_id),
        })
        .save();
      response.ok({
        status: "success",
        message: "Arena berhasil di update!",
        data: field,
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
      let venue_id = params.venue_id;

      let field = await Field.query()
        .where("id", id)
        .andWhere("venue_id", venue_id)
        .firstOrFail();

      await field.delete();
      response
        .status(200)
        .json({ status: "success", message: "Arena berhasil di hapus!" });
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
      const field = await Field.all();
      response.ok({
        status: "success",
        message: "ambil semua data fields",
        data: field,
      });

      if (request.qs().type || request.qs().venue_id) {
        const type = request.qs().type;
        const id = request.qs().venue_id;

        const field = await Venue.query()
          .preload("fields", (qField) => {
            qField.where("type", type);
          })
          .where("id", id);

        response.status(200).json({
          status: "success",
          message: "filter data lapangan berdasarkan venue id dan type",
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
}
