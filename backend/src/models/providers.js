/*
Campos:
    name
    birthday
    heigth
    DUI
    phone
*/

import { Schema, model } from "mongoose";

const providerSchema = new Schema(
  {
    name: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    heigth: {
      type: Number,
    },
    DUI: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: false,
  },
);

export default model("providers", providerSchema);
