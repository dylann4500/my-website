import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "projects",
};

export default function ProjectsPage() {
  redirect("/cv#projects");
}
