// Note Types cho ứng dụng Note Online
export type Note = {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  updatedAt: number;
};

export type NoteInput = {
  title: string;
  content: string;
  color?: string;
};
