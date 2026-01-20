export interface Board {
  board_no: number;
  board_name: string;
  board_type: string;
  display: boolean;
  use: boolean;
}

export interface Article {
  article_no: number;
  board_no: number;
  subject: string;
  writer_name: string;
  writer_id: string;
  content: string;
  read_count: number;
  comment_count: number;
  write_date: string;
}
