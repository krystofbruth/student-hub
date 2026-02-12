import type { Result } from "~/types/Result";
import {
  EventType,
  type EventView,
  type FetchEventsResponse,
} from "~~/shared/types/FetchEventsResponse";

export interface Event {
  _id: string;
  sourceId: string;
  title: string;
  type: EventType;
  dueAt: Date;
  uri: string;
}

const mapEventViewToEvent = (view: EventView): Event => {
  return {
    _id: view._id,
    sourceId: view.sourceId,
    title: view.title,
    type: view.type as EventType,
    dueAt: new Date(view.dueAt),
    uri: view.uri,
  };
};

export const useEventStore = defineStore("event", () => {
  const events: Record<EventType, { values: Ref<Event[]>; setAt?: Date }> = {
    [EventType.ASSIGNMENT]: { values: ref([]) },
    [EventType.ALTERNATION]: { values: ref([]) },
    [EventType.EXAM]: { values: ref([]) },
  };

  const setEvents = (type: EventType, values: EventView[]) => {
    const setAt = new Date();
    events[type].values.value = values.map((e) => mapEventViewToEvent(e));
    events[type].setAt = setAt;
  };

  const syncEvents = async (type: EventType): Promise<Result<undefined>> => {
    // TODO: Filter by type
    const res = await request<undefined, FetchEventsResponse>("/api/event", {
      method: "GET",
      body: undefined,
      authRequired: true,
    });
    if (!res.success) return res;

    setEvents(
      type,
      res.data.events.filter((e) => e.type === type),
    );
    return { success: true, data: undefined };
  };

  return { events, syncEvents };
});
