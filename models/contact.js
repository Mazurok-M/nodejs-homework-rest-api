const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { HandleMongooseError } = require("../helpers");

const phoneRegex = /^\(([0-9]{3})\)([ ])([0-9]{3})([-])([0-9]{4})$/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      minLength: 3,
      unique: true,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      match: phoneRegex,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", HandleMongooseError);

const contactsSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string()
    .regex(phoneRegex)
    .message("Phone format (xxx) xxx-xxxx")
    .required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = { contactsSchema, updateFavoriteSchema };

const Contact = model("contact", contactSchema);

module.exports = { Contact, schemas };
