import { NextResponse } from "next/server";
// import { checkUserModuleControlPermission } from "@/utils/function";
export async function GET() {}
export async function POST(request) {
  const { devId, value } = await request.json();

  if (value > 100 || value < 0)
    return NextResponse.json(
      {
        title: "Something went wrong",
        message:
          "We aren't able to process your requested operation. Please try again.",
      },
      { status: 500 }
    );
  try {
    return NextResponse.json({
      title: "Operation completed",
      message: "Your operation has been executed successfully",
      log: `set value to ${devId}: ${value}`,
    });
  } catch (error) {}

  return NextResponse.json({ message: "not success" }, { status: 500 });
}
