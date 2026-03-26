import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { fields } = await req.json();

  try {
    await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: "amymvarga@yahoo.co.uk",
      subject: "Beam Beam Digital form submission",
      text: fields.map((f: { label: string; value: string }) => `${f.label}: ${f.value}`).join("\n"),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}
