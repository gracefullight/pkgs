export interface Scripttag {
  shop_no: number;
  script_no: string;
  client_id: string;
  src: string;
  display_location: string[];
  skin_no?: number[] | null;
  exclude_path?: string[] | null;
  integrity?: string | null;
  created_date?: string;
  updated_date?: string;
}

export interface ScripttagsListResponse {
  scripttags: Scripttag[];
}

export interface ScripttagResponse {
  scripttag: Scripttag;
}

export interface ScripttagsCountResponse {
  count: number;
}

export interface ScripttagCreateRequest {
  shop_no?: number;
  request: {
    src: string;
    display_location: string[];
    exclude_path?: string[] | null;
    skin_no?: number[] | null;
    integrity?: string;
  };
}

export interface ScripttagUpdateRequest {
  shop_no?: number;
  request: {
    src?: string;
    display_location?: string[];
    exclude_path?: string[] | null;
    skin_no?: number[] | null;
    integrity?: string;
  };
}

export interface ScripttagDeleteResponse {
  scripttag: {
    script_no: string;
  };
}
