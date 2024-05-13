import { Audio } from "expo-av";

export interface BaseResponse<T> {
  message: string;
  body: T;
}

export interface SendMessageRequest {
  conversation_id: number;
  message_text: string;
  message_url: string;
}

export interface CreateConversationResponse {
  confidence_percent: number;
  created_at: string;
  customer_id: number;
  diagnosis: string;
  diagnosis_level: string;
  first_message_id: number;
  icon_code: number;
  id: number;
  is_finished: boolean;
  name: string;
  pre_diagnosis: string;
  updated_at: string;
  uuid: string;
}

export interface Recording {
  // sound: Audio.Sound;
  url: string;
  id: number;
  text: string;
  duration: string;
  file: string | null;
  me: boolean;
}

export interface ConversationResponse {
  [x: string]: Conversation[];
}
export interface Conversation {
  id: number;
  updated_at: string;
  created_at: string;
  uuid: string;
  name: string;
  customer_id: number;
  first_message_id: number;
  is_finished: boolean;
  diagnosis_level: string;
  pre_diagnosis: string;
  diagnosis: string;
  confidence_percent: number;
  icon_code: number;
  first_message: Message;
}

export interface UploadResponse {
  path: string;
  text: string;
}

export interface Message {
  conversation_id: number;
  created_at: string;
  customer_id: number;
  id: number;
  message_status: string;
  message_text: string;
  message_type: string;
  message_url: string;
  updated_at: string;
  used_history: string;
}
