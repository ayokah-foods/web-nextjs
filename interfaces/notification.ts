export interface NotificationPayload {
  marketing_emails: "true" | "false";
  new_products: "true" | "false";
  promotions: "true" | "false";
  push_notification: "true" | "false";
  email_notification: "true" | "false";
  sms_notification: "true" | "false";
  events: "true" | "false";
}

export interface InitialSettings {
  marketing_emails: boolean;
  new_products: boolean;
  promotions: boolean;
  push_notification: boolean;
  email_notification: boolean;
  sms_notification: boolean;
  events: boolean;
}

export interface NotificationChannels {
  push: boolean;
  emails: boolean;
  sms: boolean;
}

export interface SaveResponse {
  status: "success" | "error";
  message: string;
  error_detail?: any; 
}
