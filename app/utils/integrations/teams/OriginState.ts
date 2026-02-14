const ORIGIN_KEY = "teams_origin";

interface TeamsState {
  originId: string | null;
}

export const setOriginState = (originId: string) => {
  localStorage.setItem(ORIGIN_KEY, originId);
};

export const getOriginState = (): TeamsState => {
  const originId = localStorage.getItem(ORIGIN_KEY);
  return { originId };
};
