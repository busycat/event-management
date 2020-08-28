import { Response, Request } from "express";
import mongoose from "mongoose";
import { _Event, EventDocument, getSlug } from "../models/Event";
import { getEventType, getCityName } from "../helpers/pickRandom";
import { IncomingForm } from "formidable";
const event = mongoose.model("Event");

export const getAllEvents = async (req: Request, res: Response) => {
  const ele = await _Event.find({});
  res.json({
    name: "Ok",
    length: ele.length,
    data: ele
  });
};
export const createEvent = async (req: Request, res: Response) => {
  const form = new IncomingForm();
  form.uploadDir = __dirname + "/public/files/";
  form.keepExtensions = true;
  const image = "";
  const file = "";
  const doc = new _Event({
    description: req.body.description,
    name: req.body.name,
    slug: getSlug(req.body.name),
    lat: req.body.lat,
    lon: req.body.lon,
    city: req.body.city,
    eventDate: req.body.eventDate,
    eventType: req.body.eventType,
    image: req.body.image,
  });
  // doc.save({}, (err, obj) => {
  //   if (err) {
  //     res.json({ error: err });
  //   } else {
  //     res.json(obj);
  //   }
  // });
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
    Math.floor(Math.random() * 12),
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
