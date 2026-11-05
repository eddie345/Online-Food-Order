// src/types/africastalking.d.ts
// Strict type declarations for africastalking module

declare module "africastalking" {
  export interface AfricasTalkingCredentials {
    apiKey: string;
    username: string;
  }

  export interface SmsRecipient {
    number: string;
    status: string;
    cost: string;
    messageId: string;
  }

  export interface SmsSendResponse {
    SMSMessageData: {
      Message: string;
      Recipients: SmsRecipient[];
    };
  }

  export interface SmsSendOptions {
    to: string[];
    message: string;
    from?: string;
  }

  export interface SmsService {
    send(options: SmsSendOptions): Promise<SmsSendResponse>;
  }

  export interface AfricasTalkingInstance {
    SMS: SmsService;
  }

  export default function AfricasTalking(
    credentials: AfricasTalkingCredentials
  ): AfricasTalkingInstance;
}
