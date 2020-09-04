import mongoose from "mongoose";

export type EventDocument = mongoose.Document & {
  name: string;
  slug: string;
  eventDate: Date;
  eventType: string;
  description: string;
  location: string;
  lat: number;
  lon: number;
  image: string;
  file: string;

  getEventLink: () => string;
  getSlug: () => string;
};

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "This name already exists"],
      required: [true, "Name is required"]
    },
    slug: { type: String, unique: true },
    eventDate: Date,
    eventType: String,
    location: {
      type: String,
      minlength: [5, "Location must be minimum 5 characters"],
      maxlength: [64, "Location must be maximum 64 characters"]
    },
    lat: Number,
    lon: Number,
    image: {
      type: String,
      maxlength: [128, "Image path too long"]
    },
    description: {
      type: String,
      maxlength: [1024, "Description can be max 1024 chars long"]
    },

    file: {
      type: String,
      maxlength: [128, "File path too long"]
    }
  },
  { timestamps: true }
);
eventSchema.methods.getEventLink = function () {
  return `/event/${this.getSlug()}`;
};
export const getSlug = function (text: string) {
  if (text)
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  return text;
};
export const _Event = mongoose.model<EventDocument>("Event", eventSchema);
