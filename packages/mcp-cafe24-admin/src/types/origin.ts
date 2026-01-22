export interface Origin extends Record<string, unknown> {
  origin_place_no: string;
  origin_place_name: string[];
  foreign: "T" | "F";
  made_in_code?: string;
}

export interface OriginsResponse {
  origin: Origin[];
}
