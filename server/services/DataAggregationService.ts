import mongoose from "mongoose";
import { Result } from "../helpers/Result";
import { UnknownException } from "../exceptions/UnknownException";
import { ISource, Source } from "../models/Source";
import { Exception } from "../exceptions/Exception";
import { SynchronizationException } from "../exceptions/SynchronizationException";
import { Integration, IntegrationMap } from "../integrations/Integration";
import { Event, IEvent } from "../models/Event";

const synchronizeSourceEvent = async (
  event: IEvent,
  source: ISource
): Promise<Result<void>> => {
  try {
    const currentEvent = await Event.findOne({
      sourceId: source._id,
      targetId: event.targetId,
    });
    if (!currentEvent) {
      const newEvent = new Event(event);
      await newEvent.save();
    } else {
      currentEvent.description = event.description;
      currentEvent.title = event.title;
      currentEvent.type = event.type;
      currentEvent.uri = event.uri;
      currentEvent.dueAt = event.dueAt;
      currentEvent.save();
    }

    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};

const synchronizeSourceEvents = async (
  source: ISource
): Promise<Result<void>> => {
  try {
    const integration: Integration = await IntegrationMap[source.serviceName]();

    const eventsResult = await integration.fetchEvents(
      source.credentials,
      source._id,
      source.userId
    );
    if (!eventsResult.success) return eventsResult;

    const events = eventsResult.data;
    for (const event of events) {
      const result = await synchronizeSourceEvent(event, source);
      if (!result.success) return result;
    }

    // THIS IS EXTREMELY INEFFICIENT!
    // Should really Mongo be used for storing events after all? Since the sync interval is so small, shouldn't it be Redis or smth?
    const deletedEvents = (await Event.find({ sourceId: source._id })).filter(
      (dbEvent) =>
        !events.find(
          (fetchedEvent) => fetchedEvent.targetId === dbEvent.targetId
        )
    );
    for (const deletedEvent of deletedEvents) {
      await deletedEvent.deleteOne();
    }

    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};

export const synchronize = async (
  userId: mongoose.Types.ObjectId
): Promise<Result<void>> => {
  try {
    const sources = await Source.find({ userId });

    let exceptions: Exception[] = [];
    for (const source of sources) {
      const result = await synchronizeSourceEvents(source);
      if (!result.success) exceptions.push(result.error);
    }

    if (exceptions.length > 0)
      return {
        success: false,
        error: new SynchronizationException(exceptions),
      };

    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};
