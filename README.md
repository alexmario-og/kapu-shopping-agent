# Kapu — Kapruka Shopping Agent (Phase 1 scaffold)

A full-screen chat shopping agent for the Kapruka Agent Challenge, built with
Next.js + the Anthropic Messages API's MCP connector (pointed at
`mcp.kapruka.com/mcp`).

See `kapruka_agent_masterplan.md` (shared separately) for the full design
rationale — this README covers **getting it running**.

## 1. What's here

- `app/page.tsx` — the chat UI (full-screen, cart drawer, suggestion chips)
- `app/api/chat/route.ts` — backend route: calls Claude with the Kapruka MCP
  connector attached
- `lib/systemPrompt.ts` — Kapu's persona, language-switching, and behaviour
  rules
- `lib/parseAgentContent.ts` — turns raw MCP tool-result content into product
  cards / delivery quotes / pay links / order status for the UI
- `components/` — ProductCard, ProductCarousel, GiftBoard, DeliveryCard,
  PayLinkCard, OrderStatusCard, CartDrawer, etc.

## 2. Local setup

```bash
npm install
cp .env.example .env.local
# edit .env.local and paste your Anthropic API key
npm run dev
```

Open http://localhost:3000.

You'll need an API key from console.anthropic.com with a small amount of
credit loaded — this is required whether you build with this scaffold or
anything else, since the agent calls Claude directly.

## 3. ⚠️ Phase 1 checklist — verify the MCP response shapes

`lib/parseAgentContent.ts` was written defensively because the exact JSON
shape the Kapruka MCP returns for search/delivery/order/tracking tools hasn't
been confirmed against the live server yet. **Do this first:**

1. Run the app, ask Kapu something like "show me some Ceylon tea"
2. In `app/api/chat/route.ts`, uncomment the debug line:
   ```ts
   // console.log(JSON.stringify(response.content, null, 2));
   ```
3. Look at the real shape of the tool-result blocks in your terminal
4. Compare against the heuristics in `parseAgentContent.ts`
   (`looksLikeProduct`, `findDeliveryQuote`, `findPayLink`, `findOrderStatus`)
   and tighten the field names if they differ
5. Once product cards render correctly, repeat for: a delivery quote, a
   checkout (confirm the pay link renders, but **stop there** — don't
   complete real payment), and an order-tracking lookup

Everything else (UI, cart, persona) doesn't depend on this — only the
rich-card rendering does.

## 4. Cart behaviour (current MVP)

- "Add to cart" buttons update **local UI state only** — this gives instant
  visual feedback in the cart drawer.
- "Checkout" sends a message to Kapu listing the cart contents and asking it
  to handle delivery + order creation via its tools (which is where the real
  MCP order-creation call happens).
- This is a reasonable MVP split, but if you want the cart to also reflect
  things the agent adds *without* a button click (e.g. the user just says
  "add that to my cart" in chat), the next step is to have
  `parseAgentContent` emit a `cartNote`/cart-delta and sync it into the
  `cart` state in `app/page.tsx`.

## 5. Deploy to Vercel

1. Push this folder to a new GitHub repo
2. Go to vercel.com → "Add New… → Project" → import the repo
3. In the project's Environment Variables, add `ANTHROPIC_API_KEY` (same
   value as your `.env.local`)
4. Deploy — Vercel gives you a public `https://your-project.vercel.app` URL
5. That URL is what you submit to the challenge

## 6. Known gaps / next passes

- No streaming yet (Phase 1 keeps it simple — one request, one response).
  Streaming the response would make replies feel more alive; worth adding
  once the core loop is verified.
- Gift-mode detection is a keyword heuristic on the user's message
  (`parseAgentContent.ts`) — works for an MVP demo but could be made more
  robust.
- The language pill in the header is currently cosmetic (static text). If you
  want it to reflect the detected language live, that'd need either a tiny
  client-side script detection or Kapu reporting it back.
