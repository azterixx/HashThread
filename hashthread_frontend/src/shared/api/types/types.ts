export interface ThreadItems {
  id: string;
  _id: string;
  text: string;
  messageCount: number;
  likeCount: number;
  isLiked: boolean;
  isOp: boolean;
  files: string[];
}
interface Meta {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface CommentItems {
  id: string;
  isOp: boolean;
  text: string;
  messageNumber: number;
  likeCount: number;
  threadId: string;
  isLiked: boolean;
  replyTo: number;
}
export interface ThreadType {
  items: ThreadItems[];
  meta: Meta;
}

export interface CommentType {
  items: CommentItems[];
  meta: Meta;
}

// отправка данных
export interface PostThreadResponse {
  id: number;
  text: string;
}
export interface PostCommentResponse {
  threadId: string;
  text: string;
}
