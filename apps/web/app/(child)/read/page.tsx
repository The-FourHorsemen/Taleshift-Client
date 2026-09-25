/**
 * Owner: person 2.
 * TODO: look up the learner's actual in-progress story via
 * @taleshift/db instead of hardcoding "lost-explorer".
 */
import { redirect } from "next/navigation";

export default function ReadLandingPage() {
  redirect("/read/lost-explorer");
}
