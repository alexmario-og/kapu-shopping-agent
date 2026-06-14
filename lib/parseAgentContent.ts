import { AgentContent, DeliveryQuote, OrderStatus, PayLink, Product } from "./types";

/**
 * Turns the raw `content` array from an Anthropic Messages API response
 * (using the MCP connector) into the AgentContent shape the UI renders.
 *
 * ⚠️ PHASE 1 TODO — UNVERIFIED SHAPES
 * The exact block types/fields the Kapruka MCP returns for search,
 * delivery-quote, order-creation, and tracking tools haven't been confirmed
 * against the live server yet. This parser is written defensively:
 *  - it walks every block, regardless of exact `type` name
 *    (`mcp_tool_result`, `tool_result`, etc.)
 *  - for each tool result it tries to find embedded JSON (either as a
 *    parsed object already, or as a JSON string inside a `text` block)
 *  - it then pattern-matches the parsed JSON against "looks like a
 *    product list / delivery quote / pay link / order status"
 *
 * Once you've run a real query against mcp.kapruka.com/mcp, log
 * `JSON.stringify(response.content, null, 2)` from the API route and compare
 * against the heuristics below — tighten them to match the real field names.
 */

// ---- heuristics -----------------------------------------------------------

function looksLikeProduct(obj: any): obj is Product {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.name === "string" &&
    (obj.image_url || obj.url || obj.price !== undefined)
  );
}

function findProductArrays(node: any, found: Product[][] = []): Product[][] {
  if (Array.isArray(node)) {
    if (node.length > 0 && node.every(looksLikeProduct)) {
      found.push(node as Product[]);
    } else {
      node.forEach((child) => findProductArrays(child, found));
    }
  } else if (node && typeof node === "object") {
    Object.values(node).forEach((child) => findProductArrays(child, found));
  }
  return found;
}

function findDeliveryQuote(node: any): DeliveryQuote | undefined {
  if (node && typeof node === "object") {
    if (
      ("fee" in node || "delivery_fee" in node) &&
      ("estimated_date" in node || "delivery_date" in node || "eta" in node)
    ) {
      return {
        area: node.area ?? node.address ?? undefined,
        fee: node.fee ?? node.delivery_fee,
        estimated_date: node.estimated_date ?? node.delivery_date ?? node.eta,
      };
    }
    for (const value of Object.values(node)) {
      const result = findDeliveryQuote(value);
      if (result) return result;
    }
  }
  return undefined;
}

function findPayLink(node: any): PayLink | undefined {
  if (node && typeof node === "object") {
    const candidateUrl =
      node.pay_link ?? node.payment_url ?? node.checkout_url ?? undefined;
    if (typeof candidateUrl === "string") {
      return {
        url: candidateUrl,
        order_ref: node.order_ref ?? node.order_id ?? undefined,
        total: node.total ?? node.amount ?? undefined,
        currency: node.currency ?? undefined,
      };
    }
    for (const value of Object.values(node)) {
      const result = findPayLink(value);
      if (result) return result;
    }
  }
  return undefined;
}

function findOrderStatus(node: any): OrderStatus | undefined {
  if (node && typeof node === "object") {
    if ((node.order_ref || node.order_id) && (node.status || node.steps)) {
      const knownSteps = ["Ordered", "Packed", "Out for delivery", "Delivered"];
      const currentStatus: string = node.status ?? "";
      const steps =
        node.steps ??
        knownSteps.map((label, i) => ({
          label,
          done:
            knownSteps.findIndex(
              (s) => s.toLowerCase() === currentStatus.toLowerCase()
            ) >= i,
        }));
      return {
        order_ref: node.order_ref ?? node.order_id,
        steps,
      };
    }
    for (const value of Object.values(node)) {
      const result = findOrderStatus(value);
      if (result) return result;
    }
  }
  return undefined;
}

// Try to pull a JSON object out of a block's `content`, which may already be
// an object/array, or may be a string (sometimes wrapped in ```json fences).
function extractJson(content: unknown): any | undefined {
  if (content == null) return undefined;
  if (typeof content === "object") return content;
  if (typeof content === "string") {
    const cleaned = content.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      return undefined;
    }
  }
  if (Array.isArray(content)) {
    for (const item of content) {
      const result = extractJson((item as any)?.text ?? item);
      if (result) return result;
    }
  }
  return undefined;
}

// ---- main entry point ------------------------------------------------------

export function parseAgentContent(
  contentBlocks: any[],
  userText?: string
): AgentContent {
  let text = "";
  const products: Product[] = [];
  let delivery: DeliveryQuote | undefined;
  let payLink: PayLink | undefined;
  let orderStatus: OrderStatus | undefined;

  for (const block of contentBlocks ?? []) {
    if (block.type === "text" && typeof block.text === "string") {
      text += (text ? "\n" : "") + block.text;
      continue;
    }

    // MCP tool results show up as their own block type. We don't rely on the
    // exact name — anything with a `content` field gets inspected.
    const isToolResult =
      block.type === "mcp_tool_result" ||
      block.type === "tool_result" ||
      "content" in block;

    if (isToolResult) {
      const parsed = extractJson(block.content ?? block.output ?? block);
      if (!parsed) continue;

      findProductArrays(parsed).forEach((arr) => products.push(...arr));

      const dq = findDeliveryQuote(parsed);
      if (dq) delivery = dq;

      const pl = findPayLink(parsed);
      if (pl) payLink = pl;

      const os = findOrderStatus(parsed);
      if (os) orderStatus = os;
    }
  }

  // Heuristic gift-mode detection (Phase 1 MVP — see README for refinement
  // ideas): if the customer's message signals a gift/occasion and we got
  // back multiple products, render the curated "gift board" layout instead
  // of a plain carousel.
  const giftKeywords = [
    "gift",
    "present",
    "birthday",
    "anniversary",
    "avurudu",
    "wedding",
    "for my",
    "duwa",
    "putha",
    "thaththa",
    "amma",
  ];
  const isGiftContext =
    !!userText &&
    giftKeywords.some((kw) => userText.toLowerCase().includes(kw));

  return {
    text: text.trim(),
    products: !isGiftContext && products.length ? products : undefined,
    giftBoard: isGiftContext && products.length ? products : undefined,
    delivery,
    payLink,
    orderStatus,
  };
}
