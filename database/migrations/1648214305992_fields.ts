import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class Fields extends BaseSchema {
  protected tableName = "fields";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table
        .enum("type", ["soccer", "minisoccer", "futsal", "basketball", "volleyball"])
        .notNullable()
        .defaultTo("futsal");
      table
        .integer("venue_id")
        .notNullable()
        .unsigned()
        .references("id")
        .inTable("venues")
        .onDelete("CASCADE");
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
      // table.timestamps(true, true);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
