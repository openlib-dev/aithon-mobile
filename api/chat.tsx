import { ConversationResponse, CreateConversationResponse, Message, SendMessageRequest, UploadResponse } from "@/interface";
import http from "./http";

namespace conversation {
  export const upload = (device_id: string, body: any) => http.post<UploadResponse>("/customer/conversation/chimege-transcribe", {
    headers: {
      "device-id": device_id
    },
    body
  });

  export const list = (device_id: string) => http.post<ConversationResponse>("/customer/conversation/list", {
    headers: {
      "device-id": device_id
    }
  });
  export const create = (device_id: string) => http.post<CreateConversationResponse>("/customer/conversation/create", {
    headers: {
      "device-id": device_id
    }
  });

  export const messageList = (device_id: string, conversation_id: number) => http.post<Message[]>("/customer/conversation/message/list", {
    headers: {
      "device-id": device_id
    },
    body: {
      conversation_id
    }
  });

  export const messageSend = (device_id: string, data: SendMessageRequest) =>
    http.post<CreateConversationResponse>("/customer/conversation/message/send", {
      headers: {
        "device-id": device_id
      },
      body: data
    });
}

export default conversation;
