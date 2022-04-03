import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Bookings extends BaseSchema {
  protected tableName = "bookings";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary().notNullable();
      table
        .integer("field_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("fields")
        .onDelete("CASCADE");
      table.date("date_booking").notNullable();
      table.time("time_start").notNullable();
      table.time("time_end").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      // table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
