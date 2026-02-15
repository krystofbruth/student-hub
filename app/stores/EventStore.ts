import type { Result } from "~/types/Result";
import {
  EventType,
  type EventView,
  type FetchEventsResponse,
} from "~~/shared/types/FetchEventsResponse";

export interface Event {
  _id: string;
  sourceId: string;
  title: Record<SupportedLanguages, string>;
  description?: Record<SupportedLanguages, string>;
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
    description: view.description,
  };
};

// 30secs minimum delay if called by multiple components for example
const MINIMUM_DELAY_MS = 1000 * 30;

export const useEventStore = defineStore("event", () => {
  const events: Ref<Event[]> = ref([]);
  let setAt: Date | undefined;
  let requestPromise: Promise<Result<any>> | undefined;

  const setEvents = (values: EventView[]) => {
    setAt = new Date();
    events.value = values.map((e) => mapEventViewToEvent(e));
  };

  const syncEvents = async (): Promise<Result<undefined>> => {
    if (requestPromise) return requestPromise;

    requestPromise = request<undefined, FetchEventsResponse>("/api/event", {
      method: "GET",
      body: undefined,
      authRequired: true,
    });

    const res = await requestPromise;
    requestPromise = undefined;
    if (!res.success) return res;

    setEvents(res.data.events);
    return { success: true, data: undefined };
  };

  return { events, syncEvents, setAt };
});
