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
    name: { type: String, unique: true, required: true },
    slug: { type: String, unique: true, },
    eventDate: Date,
    eventType: String,
    location: String,
    lat: Number,
    lon: Number,
    image: String,
    description: String,
    file: String
  },
  { timestamps: true }
);
eventSchema.methods.getEventLink = function () {
  return `/event/${this.getSlug()}`;
};
export const getSlug = function (text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};
export const _Event = mongoose.model<EventDocument>("Event", eventSchema);
