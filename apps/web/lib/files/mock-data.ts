import { members as workspaceMembers } from "@/lib/projects/mock-data"

import type {
  FileActivity,
  FileNode,
  FileVersion,
  FilesData,
  ShareEntry,
} from "./types"

export const members = workspaceMembers

const now = Date.now()
function daysAgo(days: number, hours = 0) {
  return new Date(now - days * 86400000 - hours * 3600000).toISOString()
}

interface Seed {
  id: string
  name: string
  parentId: string | null
  ownerId: string
  modifiedDaysAgo: number
  sizeBytes?: number
  starred?: boolean
  shared?: boolean
  restricted?: boolean
}

const kb = 1024
const mb = 1024 * kb

const seeds: Seed[] = [
  // Root folders (owner = Aria)
  { id: "f_docs", name: "Documents", parentId: null, ownerId: "u_aria", modifiedDaysAgo: 2 },
  { id: "f_design", name: "Design", parentId: null, ownerId: "u_aria", modifiedDaysAgo: 1, shared: true },
  { id: "f_reports", name: "Reports", parentId: null, ownerId: "u_marcus", modifiedDaysAgo: 4, shared: true },
  { id: "f_images", name: "Images", parentId: null, ownerId: "u_aria", modifiedDaysAgo: 6 },
  { id: "f_projects", name: "Projects", parentId: null, ownerId: "u_aria", modifiedDaysAgo: 3 },

  // Documents
  { id: "d_welcome", name: "Welcome to Presk.docx", parentId: "f_docs", ownerId: "u_aria", modifiedDaysAgo: 9, sizeBytes: 48 * kb },
  { id: "d_meeting", name: "Meeting notes — Oct.md", parentId: "f_docs", ownerId: "u_aria", modifiedDaysAgo: 0, sizeBytes: 12 * kb, starred: true },
  { id: "d_spec", name: "Product specification.pdf", parentId: "f_docs", ownerId: "u_marcus", modifiedDaysAgo: 3, sizeBytes: 2.4 * mb, shared: true },
  { id: "d_budget", name: "Budget 2026.xlsx", parentId: "f_docs", ownerId: "u_lena", modifiedDaysAgo: 5, sizeBytes: 380 * kb, restricted: true },
  { id: "d_policy", name: "Remote work policy.docx", parentId: "f_docs", ownerId: "u_tom", modifiedDaysAgo: 21, sizeBytes: 96 * kb, shared: true },
  { id: "d_invoice", name: "Invoice — Acme.pdf", parentId: "f_docs", ownerId: "u_marcus", modifiedDaysAgo: 12, sizeBytes: 220 * kb },

  // Design
  { id: "d_tokens", name: "Design tokens.fig", parentId: "f_design", ownerId: "u_priya", modifiedDaysAgo: 1, sizeBytes: 1.1 * mb, shared: true, starred: true },
  { id: "d_brand", name: "Brand guidelines.pdf", parentId: "f_design", ownerId: "u_priya", modifiedDaysAgo: 8, sizeBytes: 8.1 * mb, shared: true },
  { id: "d_hero", name: "hero-banner.png", parentId: "f_design", ownerId: "u_priya", modifiedDaysAgo: 2, sizeBytes: 3.2 * mb },
  { id: "d_logo", name: "logo-mark.svg", parentId: "f_design", ownerId: "u_aria", modifiedDaysAgo: 4, sizeBytes: 24 * kb, starred: true },
  { id: "d_deck", name: "Design review deck.pptx", parentId: "f_design", ownerId: "u_priya", modifiedDaysAgo: 6, sizeBytes: 5.6 * mb, shared: true },

  // Reports
  { id: "d_q3", name: "Q3 results.xlsx", parentId: "f_reports", ownerId: "u_marcus", modifiedDaysAgo: 4, sizeBytes: 640 * kb, restricted: true },
  { id: "d_roadmap", name: "Roadmap 2026.pdf", parentId: "f_reports", ownerId: "u_marcus", modifiedDaysAgo: 7, sizeBytes: 1.4 * mb, shared: true },
  { id: "d_metrics", name: "metrics-export.csv", parentId: "f_reports", ownerId: "u_lena", modifiedDaysAgo: 2, sizeBytes: 128 * kb },

  // Images
  { id: "i_team", name: "team-photo.jpg", parentId: "f_images", ownerId: "u_aria", modifiedDaysAgo: 14, sizeBytes: 4.8 * mb },
  { id: "i_screenshot", name: "screenshot-dashboard.png", parentId: "f_images", ownerId: "u_jon", modifiedDaysAgo: 1, sizeBytes: 900 * kb, shared: true },
  { id: "i_mockup", name: "mobile-mockup.png", parentId: "f_images", ownerId: "u_lena", modifiedDaysAgo: 3, sizeBytes: 2.2 * mb },
  { id: "i_icon", name: "app-icon.png", parentId: "f_images", ownerId: "u_priya", modifiedDaysAgo: 10, sizeBytes: 180 * kb },

  // Projects
  { id: "p_archive", name: "Archive", parentId: "f_projects", ownerId: "u_aria", modifiedDaysAgo: 30 },
  { id: "p_launch", name: "launch-plan.docx", parentId: "f_projects", ownerId: "u_tom", modifiedDaysAgo: 5, sizeBytes: 320 * kb, shared: true },
  { id: "p_brief", name: "project-brief.md", parentId: "f_projects", ownerId: "u_aria", modifiedDaysAgo: 2, sizeBytes: 8 * kb },
  { id: "p_assets", name: "website-assets.zip", parentId: "f_projects", ownerId: "u_marcus", modifiedDaysAgo: 9, sizeBytes: 24 * mb, shared: true },
  { id: "p_demo", name: "demo-recording.mp4", parentId: "f_projects", ownerId: "u_jon", modifiedDaysAgo: 4, sizeBytes: 68 * mb },

  // Archive subfolder
  { id: "a_2025", name: "2025 summary.pdf", parentId: "p_archive", ownerId: "u_aria", modifiedDaysAgo: 60, sizeBytes: 1.2 * mb },
]

const kindById: Record<string, FileNode["kind"]> = {
  f_docs: "folder",
  f_design: "folder",
  f_reports: "folder",
  f_images: "folder",
  f_projects: "folder",
  p_archive: "folder",
  d_welcome: "document",
  d_meeting: "document",
  d_spec: "pdf",
  d_budget: "spreadsheet",
  d_policy: "document",
  d_invoice: "pdf",
  d_tokens: "other",
  d_brand: "pdf",
  d_hero: "image",
  d_logo: "image",
  d_deck: "presentation",
  d_q3: "spreadsheet",
  d_roadmap: "pdf",
  d_metrics: "spreadsheet",
  i_team: "image",
  i_screenshot: "image",
  i_mockup: "image",
  i_icon: "image",
  p_launch: "document",
  p_brief: "code",
  p_assets: "archive",
  p_demo: "video",
  a_2025: "pdf",
}

function trashedBy(id: string) {
  return ["d_invoice", "i_icon", "p_archive"].includes(id)
}

export const files: FileNode[] = seeds.map((seed) => ({
  id: seed.id,
  name: seed.name,
  kind: kindById[seed.id] ?? "other",
  parentId: seed.parentId,
  ownerId: seed.ownerId,
  modifiedAt: daysAgo(seed.modifiedDaysAgo),
  sizeBytes: kindById[seed.id] === "folder" ? undefined : seed.sizeBytes,
  starred: seed.starred ?? false,
  trashed: trashedBy(seed.id),
  trashedAt: trashedBy(seed.id) ? daysAgo(1, 3) : undefined,
  shared: seed.shared ?? false,
  restricted: seed.restricted ?? false,
}))

const shares: Record<string, ShareEntry[]> = {
  d_spec: [
    { memberId: "u_marcus", permission: "edit" },
    { memberId: "u_priya", permission: "comment" },
    { memberId: "u_jon", permission: "view" },
  ],
  d_tokens: [
    { memberId: "u_priya", permission: "edit" },
    { memberId: "u_marcus", permission: "view" },
  ],
  d_brand: [{ memberId: "u_priya", permission: "edit" }],
  d_deck: [
    { memberId: "u_priya", permission: "edit" },
    { memberId: "u_lena", permission: "comment" },
  ],
  d_roadmap: [
    { memberId: "u_marcus", permission: "edit" },
    { memberId: "u_aria", permission: "view" },
  ],
  p_assets: [{ memberId: "u_marcus", permission: "edit" }],
}

const versions: Record<string, FileVersion[]> = {
  d_spec: [
    { id: "v1", memberId: "u_marcus", at: daysAgo(3), note: "Updated pricing section" },
    { id: "v2", memberId: "u_priya", at: daysAgo(5), note: "Added design appendix" },
    { id: "v3", memberId: "u_marcus", at: daysAgo(9), note: "Initial draft" },
  ],
  d_tokens: [
    { id: "v1", memberId: "u_priya", at: daysAgo(1), note: "Bumped spacing scale" },
    { id: "v2", memberId: "u_priya", at: daysAgo(4), note: "Added dark theme tokens" },
  ],
  d_meeting: [
    { id: "v1", memberId: "u_aria", at: daysAgo(0), note: "Standup notes" },
  ],
}

const activities: Record<string, FileActivity[]> = {
  d_spec: [
    { id: "t1", memberId: "u_marcus", action: "edited this file", at: daysAgo(3) },
    { id: "t2", memberId: "u_priya", action: "commented on this file", at: daysAgo(4) },
    { id: "t3", memberId: "u_marcus", action: "shared with Priya Nair", at: daysAgo(5) },
    { id: "t4", memberId: "u_aria", action: "created this file", at: daysAgo(9) },
  ],
  d_tokens: [
    { id: "t1", memberId: "u_priya", action: "edited this file", at: daysAgo(1) },
    { id: "t2", memberId: "u_aria", action: "added to favorites", at: daysAgo(1) },
  ],
}

export const filesData: FilesData = {
  files,
  shares,
  versions,
  activities,
}
