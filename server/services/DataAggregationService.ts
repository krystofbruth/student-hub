import { Result } from "../helpers/Result";
import { UnknownException } from "../exceptions/UnknownException";
import { ISource, Source } from "../models/Source";
import { Exception } from "../exceptions/Exception";
import { SynchronizationException } from "../exceptions/SynchronizationException";
import {
  EventWithoutId,
  Integration,
  IntegrationMap,
} from "../models/Integration";
import { Event } from "../models/Event";
import { User } from "../models/User";
import { NotFoundException } from "../exceptions/NotFoundException";
import { getOrigin } from "./OriginService";
import { IOrigin } from "../models/Origin";
import mongoose from "mongoose";

const synchronizeSourceEvent = async (
  event: EventWithoutId,
  source: ISource,
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
  source: ISource,
): Promise<Result<void>> => {
  try {
    let origin: IOrigin;
    if (source.originId instanceof mongoose.Types.ObjectId) {
      const originLookup = await getOrigin(source.originId);
      // This shouldn't happen!
      if (!originLookup.success)
        return {
          success: false,
          error: new UnknownException(originLookup.error),
        };

      origin = originLookup.data;
    } else {
      origin = source.originId;
    }

    const integration: Integration =
      await IntegrationMap[origin.integrationName]();

    const eventsResult = await integration.fetchEvents(
      source.credentials,
      source._id,
      source.userId,
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
          (fetchedEvent) => fetchedEvent.targetId === dbEvent.targetId,
        ),
    );
    for (const deletedEvent of deletedEvents) {
      await deletedEvent.deleteOne();
    }

    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};

const SYNC_INTERVAL_MS = 1000 * 30;

/** Handles synchronization as well as synchronization intervals. */
export const synchronize = async (
  userId: string,
  force?: boolean,
): Promise<Result<void>> => {
  try {
    // Inefficient - utilize a Redis or similiar short-term caching DB in the future
    const user = await User.findById(userId);
    if (!user) throw new NotFoundException(userId.toString());
    if (Date.now() - user.lastSync.getTime() < SYNC_INTERVAL_MS && !force)
      return { success: true, data: undefined };

    const sources = await Source.find({ userId }).populate("originId");
    const sourceIds = sources.map((s) => s._id);

    let exceptions: Exception[] = [];
    for (const source of sources) {
      const result = await synchronizeSourceEvents(source);
      if (!result.success) exceptions.push(result.error);
    }

    // Delete events which don't have a source anymore.
    await Event.deleteMany({
      userId: user._id,
      sourceId: { $nin: sourceIds },
    });

    if (exceptions.length > 0)
      return {
        success: false,
        error: new SynchronizationException(exceptions),
      };

    user.lastSync = new Date();
    await user.save();

    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};
