// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
const { Model } = require("objection");

class users extends Model {
  static get tableName() {
    return "users";
  }

  static get relationMappings() {
    const userDeviceTokens = require("./user-device-tokens.model")();

    return {
      "user-device-tokens": {
        relation: Model.HasManyRelation,
        modelClass: userDeviceTokens,
        join: {
          from: "users.id",
          to: "user_device_tokens.user_id",
        },
      },
    };
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [],

      properties: {
        id: { type: "integer" },
        email: { type: ["string", "null"] },
        password: { type: "string" },
        first_name: { type: "string", minLength: 1, maxLength: 255 },
        last_name: { type: "string", minLength: 1, maxLength: 255 },
        dni: { type: "string", maxLength: 255 },
        status: {
          type: "string",
          enum: [
            "active",
            "inactive",
            "pending validation",
            "pending user data",
            "pending security verification",
          ],
          default: "pending validation",
        },
        role: { type: "string", enum: ["user", "admin"] },
        facebookId: { type: "string" },
        gender: { type: "string", enum: ["male", "female"] },
        birthday: { type: "string", format: "date" },
        token_reset_password: { type: "string" },
        phone: { type: "string", maxLength: 255 },
        token_login_email: { type: "string", maxLength: 255 },
        token_login_phone: { type: "string", maxLength: 255 },
        phone_country_code: { type: "string", maxLength: 6 },
        credits: { type: "integer" },
        profile_picture: { type: "string" },
        company_id: { type: "integer" },
        owner_company: { type: "string", enum: ["true", "false"] },
        person_type: { type: "string", enum: ["legal", "natural"] },
        deletedAt: { type: "string", format: "date-time" },
      },
    };
  }

  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

module.exports = function (app) {
  if (app) {
    const db = app.get("knex");

    db.schema
      .hasTable("users")
      .then((exists) => {
        if (!exists) {
          db.schema
            .createTable("users", (table) => {
              table.increments("id").primary();
              table.string("email").unique();
              table.string("password");
              table.string("first_name");
              table.string("last_name");
              table.string("dni");
              table.enum("role", ["user", "admin"]).defaultTo("user");
              table.string("facebookId");
              table.enum("gender", ["male", "female"]);
              table.date("birthday");
              table.string("token_reset_password");
              table.string("phone", 255);
              table
                .enum("status", [
                  "active",
                  "inactive",
                  "pending validation",
                  "pending user data",
                  "pending security verification",
                ])
                .defaultTo("pending validation");
              table.integer("credits", 255).defaultTo(0);
              table.text("profile_picture", 255);
              table.string("token_login_email", 20);
              table.string("token_login_phone", 20);
              table.string("phone_country_code", 20);
              table.timestamp("deletedAt").nullable();
              table.timestamp("createdAt");
              table.timestamp("updatedAt");
            })
            .then(() => console.log("Created users table")) // eslint-disable-line no-console
            .catch((e) => console.error("Error creating users table", e)); // eslint-disable-line no-console
        }
      })
      .catch((e) => console.error("Error creating users table", e)); // eslint-disable-line no-console
  }

  return users;
};
