"use client"

import { SearchIcon, XIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import type { Task } from "@/lib/projects/types"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group"

import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/projects/types"

const statusItems = [
  { label: "All statuses", value: "all" },
  ...TASK_STATUSES.map((status) => ({
    label: status.label,
    value: status.value,
  })),
]

const assigneeItems = [
  { label: "All assignees", value: "all" },
  { label: "Assigned to me", value: "me" },
  { label: "Unassigned", value: "unassigned" },
]

export interface TaskFilters {
  search: string
  status: TaskStatus | "all"
  assignee: "all" | "me" | "unassigned"
  priorities: TaskPriority[]
}

export const defaultFilters: TaskFilters = {
  search: "",
  status: "all",
  assignee: "all",
  priorities: [],
}

export function ProjectFilters({
  filters,
  onChange,
}: {
  filters: TaskFilters
  onChange: (filters: TaskFilters) => void
}) {
  const active =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.assignee !== "all" ||
    filters.priorities.length > 0

  return (
    <div className="flex flex-wrap items-center gap-2">
      <InputGroup className="w-full sm:w-64">
        <InputGroupInput
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      <Select
        items={statusItems}
        value={filters.status}
        onValueChange={(value) =>
          onChange({ ...filters, status: value as TaskStatus | "all" })
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {statusItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        items={assigneeItems}
        value={filters.assignee}
        onValueChange={(value) =>
          onChange({
            ...filters,
            assignee: value as TaskFilters["assignee"],
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {assigneeItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <ToggleGroup
        multiple
        value={filters.priorities}
        onValueChange={(value) =>
          onChange({ ...filters, priorities: value as TaskPriority[] })
        }
        spacing={2}
        className="flex-wrap"
      >
        {TASK_PRIORITIES.map((priority) => (
          <ToggleGroupItem
            key={priority.value}
            value={priority.value}
            variant="outline"
            size="sm"
          >
            {priority.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      {active ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(defaultFilters)}
        >
          <XIcon data-icon="inline-start" />
          Clear
        </Button>
      ) : null}
    </div>
  )
}

export function filterTasks(
  tasks: Task[],
  filters: TaskFilters,
  currentUserId: string
): Task[] {
  return tasks.filter((task) => {
    if (
      filters.search &&
      !`${task.title} ${task.identifier}`
        .toLowerCase()
        .includes(filters.search.toLowerCase())
    ) {
      return false
    }
    if (filters.status !== "all" && task.status !== filters.status) {
      return false
    }
    if (filters.assignee === "unassigned" && task.assigneeId) return false
    if (filters.assignee === "me" && task.assigneeId !== currentUserId) {
      return false
    }
    if (
      filters.priorities.length > 0 &&
      !filters.priorities.includes(task.priority)
    ) {
      return false
    }
    return true
  })
}
