export interface ProviderView {
  _id: string;
  name: string;
  city: string;
  logoUri: string;
}

export interface FetchProvidersResponse {
  success: true;
  data: ProviderView[];
}
