import { RegisteredIntegrationNames } from "./RegisteredIntegrationNames";
import type { ProviderView } from "./FetchProvidersResponse";

export interface OriginView {
  _id: string;
  provider?: ProviderView;
  integrationName: RegisteredIntegrationNames;
  name: {
    en: string;
    cs: string;
  };
  description: {
    en: string;
    cs: string;
  };
  logoUri: string;
  logoUriDark?: string;
}

export interface FetchOriginsResponse {
  success: true;
  data: OriginView[];
}
