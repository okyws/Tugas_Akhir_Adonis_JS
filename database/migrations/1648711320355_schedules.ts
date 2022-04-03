import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Schedules extends BaseSchema {
  protected tableName = 'schedules'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary().notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("users.id")
        .notNullable();
      table
        .integer("booking_id")
        .unsigned()
        .references("bookings.id")
        .notNullable();
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      // table.timestamps(true, true);
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
