import { NextResponse } from "next/server";
import { saveContact } from "./services/contact-service";

export async function POST(request) {
  const body = await request.json();
  try {
    const result = await saveContact(body);
    if (result === "success")
      return NextResponse.json({ message: "OK", result }, { status: 201 });
    else {
      return NextResponse.json(
        { message: "Error while insert data" },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
