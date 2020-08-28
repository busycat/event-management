import { Response, Request } from "express";
import mongoose from "mongoose";
import { _Event, EventDocument, getSlug } from "../models/Event";
import { getEventType, getCityName } from "../helpers/pickRandom";

const event = mongoose.model("Event");

export const getAllEvents = async (req: Request, res: Response) => {
  const ele = await _Event.find({});
  res.json({
    name: "Ok",
    length: ele.length,
    data: ele
  });
};

export const uploadFile = (req: Request, res: Response) => {
  res.write(_Event.modelName);
};

export const Seed = (_req: Request, res: Response) => {
  const eventType = getEventType();
  const city = getCityName();
  const name = `${eventType} ${city.city.city}`;
  const slug = getSlug(name);
  const image = `/images/${Math.floor(Math.random() * 4) + 1}.webp`;
  const eventDate = new Date(
    2020,
    Math.floor(Math.random() * 12) ,
    Math.floor(Math.random() * 30) + 1
  );
  const p = new event({
    name,
    slug,
    eventType,
    image,
    eventDate,
    location: `${city.city.city},${city.state.key}`,
    description: "This is description",
    lat: 25.5,
    lon: 58.97,
    file: "/files/f1"
  } as EventDocument);
  p.save((err, doc) => {
    if (err) {
      if (err.code === 11000) res.statusCode = 409;
      res.json(err);
    } else {
      res.json(doc);
    }
  });
};
