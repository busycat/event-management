import { Response, Request } from "express";
import mongoose from "mongoose";
import { _Event, EventDocument, getSlug } from "../models/Event";
import { getEventType, getCityName } from "../helpers/pickRandom";
import { IncomingForm } from "formidable";
import { uploadDir } from "../const";
import { rename } from "fs";
import { extname } from "path";
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
  // form.uploadDir = "/tmp";
  form.keepExtensions = true;
  try {
    form.parse(req, (err, fields, files) => {
      const slug = getSlug(fields.name as string);
      const fileField: { newPath: string; oldPath: string; url: string } = {
        oldPath: files.file.path,
        newPath: uploadDir + slug + extname(files.file.name),
        url: "images/" + slug + extname(files.file.name)
      };
      const imageField: { newPath: string; oldPath: string; url: string } = {
        oldPath: files.image.path,
        newPath: uploadDir + slug + extname(files.image.name),
        url: "images/" + slug + extname(files.image.name)
      };
      rename(fileField.oldPath, fileField.newPath, () => {
        // Not handled
      });
      rename(imageField.oldPath, imageField.newPath, () => {
        // Not handled
      });

      const doc = new _Event({
        description: fields.description,
        name: fields.name,
        slug: getSlug(fields.name as string),
        lat: fields.lat,
        lon: fields.lon,
        location: fields.location,
        city: fields.city,
        eventDate: fields.eventDate,
        eventType: fields.eventType,
        image: imageField.url,
        file: fileField.url
      });

      doc.save({}, (err, obj) => {
        if (err || !obj) {
          res.statusCode = 400;
          res.json(err);
        } else {
          res.json(obj);
        }
      });
    });
  } catch {
    res.json({ sd: "Error" });
  }
};
export const updateEvent = async (req: Request, res: Response) => {
  const id = req.params.id;
  const event = await _Event.findById(id);

  if (!event || !event._id) {
    res.render("error", { message: "Event not found." });
    res.end();
  } else {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      console.log(fields.eventDate);
      event.name = "" + fields.name;
      event.eventDate = new Date(Date.parse("" + fields.eventDate));
      event.eventType = "" + fields.eventType;
      event.location = "" + fields.location;
      event.lat = +fields.lat;
      event.lon = +fields.lon;
      event.description = "" + fields.description;
      event.save((a, e) => {
        if (a && !e) res.json(a || e);
        else res.json({ success: true });
      });
    });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  const id = req.params.id;

  _Event.findByIdAndDelete(id, (a, b) => {
    if (!a) {
      res.json({ success: true });
    } else {
      res.statusCode = 400;
      res.json(a);
    }
  });
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
