export interface BakalariOriginCredentials {
  username: string;
  password: string;
  /** Complete base URI, including scheme, domain and prefix path, without the trailing slash - e.g. https://bakalari.skola.cz/if/2 */
  baseUri: string;
  /** URI of the main log-in portal. */
  publicUri: string;
}

export interface BakalariCredentials {
  classId: string;
}
