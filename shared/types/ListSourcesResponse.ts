import type { OriginView } from "./FetchOriginsResponse";

export interface SourceView {
  _id: string;
  userId: string;
  serviceName: string;
  createdAt: string;
  origin: OriginView;
}

export interface ListSourcesResponse {
  success: true;
  data: SourceView[];
}
