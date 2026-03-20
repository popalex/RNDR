import { redirect } from "next/navigation";

/** Root route: redirect straight to the studio */
export default function Home() {
  redirect("/studio");
}
