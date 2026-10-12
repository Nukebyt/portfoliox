import blogCards from "../../content/blogCards.json";
import certificates from "../../content/certificates.json";
import events from "../../content/events.json";
import projects from "../../content/projects.json";
import skills from "../../content/skills.json";
import {
  education,
  technologies,
  type BlogCard,
  type Certificate,
  type EventCard,
  type Project,
  type Skill,
} from "@/lib/content";

// Content is edited with `npm run post` and committed to the repo, so there is
// no database to go down. See scripts/post.mjs.
export function getPortfolioContent() {
  return {
    skills: skills as Skill[],
    projects: projects as Project[],
    blogCards: blogCards as BlogCard[],
    events: events as EventCard[],
    certificates: certificates as Certificate[],
    education,
    technologies,
  };
}
