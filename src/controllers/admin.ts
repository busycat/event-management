import { Response, Request } from "express";
import { _Event } from "../models/Event";
export const getTable = async (req: Request, res: Response) => {
  const page = req.query.page || 0;
  const limit = req.query.limit || 10;
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
    res.render("admin/list", {
      title: "Admin",
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

export const editOne = async (req: Request, res: Response) => {
  const id = req.params.id ;
  const event = await _Event.findById(id);

  if (!event || !event._id) {
    res.render("error", { message: "Event not found." });
    res.end();
  }
  else
    res.render("admin/edit", {
      title: "Admin",
      event,
    });
};
