import { NextResponse } from "next/server";
import { getEvents, addEvent } from "@/lib/event-storage";

export async function GET() {
  try {
    const events = await getEvents();
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const event = await addEvent(data);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("máximo")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to add event" }, { status: 500 });
  }
}
