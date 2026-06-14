import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";
import { parseAgentContent } from "@/lib/parseAgentContent";

// This route is intentionally simple for Phase 1: one request in, one
// response out (no streaming yet). The MCP connector means Claude itself
// calls the Kapruka search/delivery/order tools — this route doesn't need
// any MCP client code at all.

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const KAPRUKA_MCP_URL =
  process.env.KAPRUKA_MCP_URL ?? "https://mcp.kapruka.com/mcp";

export async function POST(req: NextRequest) {
  try {
    const { history, message } = await req.json();

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Missing `message`." },
        { status: 400 }
      );
    }

    const messages: Anthropic.Beta.BetaMessageParam[] = [
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: message },
    ];

    const response = await anthropic.beta.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages,
      mcp_servers: [
        {
          type: "url",
          url: KAPRUKA_MCP_URL,
          name: "kapruka",
        },
      ],
      tools: [{ type: "mcp_toolset", mcp_server_name: "kapruka" } as any],
      betas: ["mcp-client-2025-11-20"],
    });

    // DEBUG (Phase 1): uncomment while verifying the real MCP response shape.
    // console.log(JSON.stringify(response.content, null, 2));

    const display = parseAgentContent(response.content as any[], message);

    const updatedHistory = [
      ...messages,
      { role: "assistant", content: response.content },
    ];

    return NextResponse.json({ history: updatedHistory, display });
  } catch (err: any) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Something went wrong talking to Kapu." },
      { status: 500 }
    );
  }
}
