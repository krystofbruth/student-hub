import { ExtendedResult } from "../helpers/Result";
import { Event, IEvent } from "../models/Event";
import { UnknownException } from "../exceptions/UnknownException";
import { synchronize } from "./DataAggregationService";

export const fetchEvents = async (
  userId: string,
  parameters: {
    offset?: number;
    limit?: number;
  } = {}
): Promise<ExtendedResult<IEvent[]>> => {
  const filter = { userId };
  const offset = parameters.offset ?? 0;
  const limit = parameters.limit ?? 50;

  const sync = await synchronize(userId);

  try {
    const response = await Event.find(filter).skip(offset).limit(limit);
    if (!sync.success)
      return { success: "PARTIAL", data: response, errors: sync.error };
    else return { success: true, data: response };
  } catch (error) {
    return { success: false, error: new UnknownException(error) };
  }
};
