import { Schema, model } from "mongoose";

const contactSchema = new Schema(
  {
    ownerId: {
      type: Number,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    profilePhoto: {
      type: String,
    },
    sharedWithMe: [
      {
        type: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default model("Contact", contactSchema);
