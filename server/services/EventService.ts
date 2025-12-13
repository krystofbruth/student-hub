import mongoose from "mongoose";
import { Result } from "../helpers/Result";
import { Event, IEvent } from "../models/Event";
import { UnknownException } from "../exceptions/UnknownException";

export const fetchEvents = async (
  parameters: {
    userId?: string;
    offset?: number;
    limit?: number;
  } = {}
): Promise<Result<IEvent[]>> => {
  const filter = parameters.userId ? { userId: parameters.userId } : {};
  const offset = parameters.offset ?? 0;
  const limit = parameters.limit ?? 50;

  try {
    const response = await Event.find(filter).skip(offset).limit(limit);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};
