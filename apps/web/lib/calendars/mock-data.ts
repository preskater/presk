import { members as workspaceMembers } from "@/lib/projects/mock-data"

import type {
  Attendee,
  CalendarData,
  CalendarEvent,
  CalendarSource,
  EventColor,
} from "./types"

export const members = workspaceMembers

const anchor = new Date()
anchor.setHours(0, 0, 0, 0)

function at(dayOffset: number, hour: number, minute = 0) {
  const date = new Date(anchor)
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hour, minute, 0, 0)
  return date
}

function iso(dayOffset: number, hour: number, minute = 0) {
  return at(dayOffset, hour, minute).toISOString()
}

function attendee(memberId: string, response: Attendee["response"]): Attendee {
  return { memberId, response }
}

export const calendars: CalendarSource[] = [
  {
    id: "cal_personal",
    name: "Personal",
    color: "blue",
    kind: "personal",
    visible: true,
    memberIds: ["u_aria"],
  },
  {
    id: "cal_work",
    name: "Work",
    color: "purple",
    kind: "personal",
    visible: true,
    memberIds: ["u_aria"],
  },
  {
    id: "cal_holidays",
    name: "Holidays",
    color: "green",
    kind: "personal",
    visible: true,
    memberIds: ["u_aria", "u_marcus", "u_priya", "u_jon", "u_lena", "u_tom"],
  },
  {
    id: "cal_engineering",
    name: "Engineering",
    color: "orange",
    kind: "team",
    visible: true,
    memberIds: ["u_aria", "u_marcus", "u_jon", "u_lena"],
  },
  {
    id: "cal_design",
    name: "Design",
    color: "red",
    kind: "team",
    visible: true,
    memberIds: ["u_aria", "u_priya", "u_marcus"],
  },
  {
    id: "cal_marketing",
    name: "Marketing",
    color: "blue",
    kind: "team",
    visible: false,
    memberIds: ["u_aria", "u_tom", "u_priya"],
  },
]

interface Seed {
  day: number
  startHour: number
  startMinute?: number
  endHour: number
  endMinute?: number
  title: string
  calendarId: string
  color: EventColor
  attendees?: Attendee[]
  description?: string
  location?: string
  meetingUrl?: string
  allDay?: boolean
  reminderMinutes?: number
}

const seeds: Seed[] = [
  {
    day: 0,
    startHour: 9,
    endHour: 9,
    endMinute: 15,
    title: "Engineering standup",
    calendarId: "cal_engineering",
    color: "orange",
    attendees: [
      attendee("u_aria", "accepted"),
      attendee("u_jon", "accepted"),
      attendee("u_lena", "tentative"),
    ],
    location: "Teams",
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/standup",
  },
  {
    day: 0,
    startHour: 10,
    endHour: 11,
    title: "Design critique",
    calendarId: "cal_design",
    color: "red",
    attendees: [
      attendee("u_priya", "accepted"),
      attendee("u_marcus", "accepted"),
    ],
    location: "Studio B",
  },
  {
    day: 0,
    startHour: 13,
    endHour: 13,
    endMinute: 30,
    title: "1:1 with Marcus",
    calendarId: "cal_work",
    color: "purple",
    attendees: [attendee("u_marcus", "accepted")],
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/one-on-one",
  },
  {
    day: 0,
    startHour: 15,
    endHour: 16,
    title: "Roadmap review",
    calendarId: "cal_work",
    color: "purple",
    attendees: [
      attendee("u_marcus", "accepted"),
      attendee("u_priya", "tentative"),
      attendee("u_lena", "accepted"),
    ],
    description: "Q4 roadmap and staffing.",
    location: "Boardroom",
  },
  {
    day: 1,
    startHour: 9,
    endHour: 9,
    endMinute: 15,
    title: "Engineering standup",
    calendarId: "cal_engineering",
    color: "orange",
    attendees: [attendee("u_aria", "accepted"), attendee("u_jon", "accepted")],
  },
  {
    day: 1,
    startHour: 11,
    endHour: 12,
    title: "API platform sync",
    calendarId: "cal_engineering",
    color: "orange",
    attendees: [
      attendee("u_marcus", "accepted"),
      attendee("u_lena", "accepted"),
    ],
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/api-platform",
  },
  {
    day: 1,
    startHour: 14,
    endHour: 15,
    title: "Marketing launch prep",
    calendarId: "cal_marketing",
    color: "blue",
    attendees: [attendee("u_tom", "accepted"), attendee("u_priya", "accepted")],
  },
  {
    day: 2,
    startHour: 9,
    endHour: 9,
    endMinute: 15,
    title: "Engineering standup",
    calendarId: "cal_engineering",
    color: "orange",
    attendees: [attendee("u_aria", "accepted"), attendee("u_lena", "accepted")],
  },
  {
    day: 2,
    startHour: 10,
    endHour: 12,
    title: "Sprint planning",
    calendarId: "cal_engineering",
    color: "orange",
    attendees: [
      attendee("u_aria", "accepted"),
      attendee("u_marcus", "accepted"),
      attendee("u_jon", "accepted"),
      attendee("u_lena", "declined"),
    ],
    location: "Teams",
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/sprint-planning",
  },
  {
    day: 2,
    startHour: 16,
    endHour: 16,
    endMinute: 45,
    title: "Customer onboarding review",
    calendarId: "cal_work",
    color: "purple",
    attendees: [attendee("u_tom", "tentative")],
  },
  {
    day: 3,
    startHour: 9,
    endHour: 9,
    endMinute: 15,
    title: "Engineering standup",
    calendarId: "cal_engineering",
    color: "orange",
    attendees: [attendee("u_aria", "accepted"), attendee("u_jon", "accepted")],
  },
  {
    day: 3,
    startHour: 13,
    endHour: 14,
    title: "Design tokens workshop",
    calendarId: "cal_design",
    color: "red",
    attendees: [attendee("u_priya", "accepted"), attendee("u_aria", "accepted")],
  },
  {
    day: 3,
    startHour: 15,
    endHour: 16,
    title: "Hiring panel debrief",
    calendarId: "cal_work",
    color: "purple",
    attendees: [attendee("u_marcus", "accepted")],
    location: "Room 4",
  },
  {
    day: 4,
    startHour: 9,
    endHour: 9,
    endMinute: 15,
    title: "Engineering standup",
    calendarId: "cal_engineering",
    color: "orange",
    attendees: [attendee("u_aria", "accepted")],
  },
  {
    day: 4,
    startHour: 10,
    endHour: 11,
    title: "Billing migration retro",
    calendarId: "cal_engineering",
    color: "orange",
    attendees: [
      attendee("u_marcus", "accepted"),
      attendee("u_lena", "accepted"),
    ],
  },
  {
    day: 4,
    startHour: 14,
    endHour: 17,
    title: "Focus time",
    calendarId: "cal_personal",
    color: "blue",
    description: "Deep work — notifications off.",
  },
  {
    day: 6,
    startHour: 18,
    endHour: 20,
    title: "Dinner with friends",
    calendarId: "cal_personal",
    color: "blue",
    location: "Riverside",
  },
  {
    day: 8,
    startHour: 9,
    endHour: 9,
    endMinute: 15,
    title: "Engineering standup",
    calendarId: "cal_engineering",
    color: "orange",
    attendees: [attendee("u_aria", "accepted")],
  },
  {
    day: 8,
    startHour: 11,
    endHour: 12,
    title: "Quarterly business review",
    calendarId: "cal_work",
    color: "purple",
    attendees: [
      attendee("u_marcus", "accepted"),
      attendee("u_priya", "accepted"),
      attendee("u_lena", "tentative"),
    ],
    location: "Boardroom",
  },
  {
    day: 9,
    startHour: 10,
    endHour: 11,
    endMinute: 30,
    title: "Mobile v2 demo",
    calendarId: "cal_engineering",
    color: "orange",
    attendees: [
      attendee("u_jon", "accepted"),
      attendee("u_lena", "accepted"),
      attendee("u_aria", "accepted"),
    ],
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/mobile-demo",
  },
  {
    day: 10,
    startHour: 13,
    endHour: 14,
    title: "Design system office hours",
    calendarId: "cal_design",
    color: "red",
    attendees: [attendee("u_priya", "accepted")],
  },
  {
    day: 11,
    startHour: 15,
    endHour: 16,
    title: "Partners sync",
    calendarId: "cal_work",
    color: "purple",
    attendees: [attendee("u_marcus", "tentative")],
  },
]

export const events: CalendarEvent[] = [
  ...seeds.map((seed, index) => ({
    id: `ev_${index + 1}`,
    title: seed.title,
    description: seed.description,
    startAt: iso(seed.day, seed.startHour, seed.startMinute ?? 0),
    endAt: iso(seed.day, seed.endHour, seed.endMinute ?? 0),
    calendarId: seed.calendarId,
    color: seed.color,
    attendees: seed.attendees ?? [],
    location: seed.location,
    meetingUrl: seed.meetingUrl,
    reminderMinutes: seed.reminderMinutes ?? 15,
    createdBy: "u_aria",
  })),
  // All-day holiday spanning one day.
  {
    id: "ev_holiday",
    title: "Company holiday",
    calendarId: "cal_holidays",
    color: "green",
    allDay: true,
    startAt: iso(5, 0),
    endAt: iso(5, 23, 59),
    attendees: [
      attendee("u_aria", "accepted"),
      attendee("u_marcus", "accepted"),
      attendee("u_priya", "accepted"),
      attendee("u_jon", "accepted"),
      attendee("u_lena", "accepted"),
      attendee("u_tom", "accepted"),
    ],
    createdBy: "u_marcus",
  },
]

export const calendarData: CalendarData = {
  calendars,
  events,
}
