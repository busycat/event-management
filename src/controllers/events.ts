import { Response, Request } from "express";
import { _Event } from "../models/Event";
export const index = async (req: Request, res: Response) => {
  const page = req.query.page || 0;
  const limit = req.query.limit || 12;
  const l = (await _Event.countDocuments()) - 1 || 0;
  const lastPage = Math.floor(l / limit) + 1;
  if (lastPage <= page) {
    res.render("error", { message: "Invalid Link" });
    return;
  }
  const events = await _Event
    .find({})
    .sort("slug")
    .skip(page * limit)
    .limit(limit);
  const pages = Array.from(Array(lastPage).keys());
  if (events.length === 0)
    res.render("error", { message: "No events to view" });
  else
    res.render("events/index", {
      title: "Public Events",
      events,

      paginate:
        lastPage > 1
          ? {
              page,
              limit,
              pages,
              lastPage
            }
          : undefined
    });
};

export const eventPage = async (req: Request, res: Response) => {
  const event = await _Event.findOne({ slug: req.params.id });
  if (!event) res.render("not-found", { message: "Event not found" });
  res.render("events/view", {
    title: "Events",
    event
  });
};
