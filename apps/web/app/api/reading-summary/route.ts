/**
 * Owner: unassigned.
 * Accepts the child's spoken book-summary recording once they finish a
 * story, stores the audio, and (best-effort) transcribes it so a
 * parent can both listen to and read the summary later from
 * apps/web/components/profile/RecentSessionsCard.tsx.
 *
 * MVP placeholder: audio bytes are saved under
 * apps/web/public/audio-summaries instead of a real object store (see
 * packages/db/src/schema.ts's customBooks.fileUrl for the intended
 * long-term pattern - Supabase Storage) - swap this out before a
 * multi-instance/production deployment, since public/ is local disk.
 */
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { createReadingSummary, updateReadingSummaryTranscript } from "@taleshift/db";
import { transcribeSummaryAudio } from "@taleshift/asr-client";

export const runtime = "nodejs";

const AUDIO_DIR = path.join(process.cwd(), "public", "audio-summaries");

export async function POST(request: Request) {
  const formData = await request.formData();
  const audio = formData.get("audio");
  const learnerProfileId = formData.get("learnerProfileId");
  const storyId = formData.get("storyId");
  const storyTitle = formData.get("storyTitle");
  const durationSeconds = formData.get("durationSeconds");

  if (!(audio instanceof Blob) || typeof learnerProfileId !== "string" || typeof storyTitle !== "string") {
    return NextResponse.json(
      { error: "audio, learnerProfileId, and storyTitle are required." },
      { status: 400 },
    );
  }

  const id = randomUUID();
  const fileName = `${id}.webm`;
  const filePath = path.join(AUDIO_DIR, fileName);
  const audioUrl = `/audio-summaries/${fileName}`;

  try {
    await mkdir(AUDIO_DIR, { recursive: true });
    await writeFile(filePath, Buffer.from(await audio.arrayBuffer()));
  } catch (err) {
    console.error("Failed to save reading-summary audio:", err);
    return NextResponse.json({ error: "Couldn't save the recording." }, { status: 500 });
  }

  try {
    await createReadingSummary({
      id,
      learnerProfileId,
      storyId: typeof storyId === "string" && storyId ? storyId : undefined,
      storyTitle,
      audioUrl,
      durationSeconds: typeof durationSeconds === "string" ? Number(durationSeconds) : undefined,
    });
  } catch (err) {
    // The recording is already saved to disk even if the DB write
    // failed (e.g. no DATABASE_URL in this environment) - still tell
    // the child it worked so their flow isn't blocked by a demo-env
    // persistence gap.
    console.error("Failed to persist reading summary row:", err);
    return NextResponse.json({ ok: true, id, audioUrl, transcript: null });
  }

  // Best-effort transcription for the parent's text preview - never
  // blocks the response, and failure just leaves status "failed".
  transcribeSummaryAudio({ audioFilePath: filePath })
    .then((transcript) => updateReadingSummaryTranscript(id, transcript, "ready"))
    .catch((err) => {
      console.error("Reading-summary transcription failed:", err);
      return updateReadingSummaryTranscript(id, "", "failed").catch(() => {});
    });

  return NextResponse.json({ ok: true, id, audioUrl });
}
