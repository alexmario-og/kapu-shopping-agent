// Shared types for the Kapu chat UI.
//
// NOTE on `Product` and `mcp_tool_result` shapes:
// The exact JSON returned by the Kapruka MCP's search/order tools hasn't been
// verified against the live server yet (see README "Phase 1 checklist").
// `parseAgentContent.ts` extracts fields defensively and the fields below
// reflect the names mentioned in the challenge brief (`image_url`, `url`,
// plus the usual name/price). Adjust here first if the live shape differs —
// everything else reads from this type.

export type Role = "user" | "assistant";

export interface Product {
  id?: string;
  name: string;
  price?: string | number;
  currency?: string;
  image_url?: string;
  url?: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface DeliveryQuote {
  area?: string;
  fee?: string | number;
  estimated_date?: string;
}

export interface PayLink {
  url: string;
  order_ref?: string;
  total?: string | number;
  currency?: string;
}

export interface OrderStatus {
  order_ref: string;
  steps: { label: string; done: boolean }[];
}

// A parsed, UI-ready representation of one assistant turn.
// `text` is the conversational reply; the rest are optional rich blocks
// extracted from MCP tool results, rendered as cards/carousels/etc.
export interface AgentContent {
  text: string;
  products?: Product[];
  giftBoard?: Product[];
  delivery?: DeliveryQuote;
  payLink?: PayLink;
  orderStatus?: OrderStatus;
  cartNote?: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  // For user messages this is plain text.
  // For assistant messages this is the parsed AgentContent.
  content: string | AgentContent;
}
