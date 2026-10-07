"use client"

import * as React from "react"
import {
  ArrowDownUpIcon,
  FolderPlusIcon,
  LayoutGridIcon,
  ListIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react"

import { FolderDialog } from "@/components/files/folder-dialog"
import { FileUploadDialog } from "@/components/files/file-upload-dialog"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
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

import type { FileLocation, FileNode } from "@/lib/files/types"

export type SortOption = "name" | "owner" | "modifiedAt" | "sizeBytes"
export type ViewMode = "list" | "grid"

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "modifiedAt", label: "Last modified" },
  { value: "sizeBytes", label: "Size" },
]

const FILTER_OPTIONS = [
  { value: "all", label: "All types" },
  { value: "folder", label: "Folders" },
  { value: "document", label: "Documents" },
  { value: "image", label: "Images" },
  { value: "spreadsheet", label: "Spreadsheets" },
]

export function FilesToolbar({
  breadcrumb,
  query,
  onQueryChange,
  view,
  onViewChange,
  sort,
  onSortChange,
  filter,
  onFilterChange,
  onNavigateRoot,
  onNavigateFolder,
  folderId,
  onSearch,
}: {
  breadcrumb: FileNode[]
  query: string
  onQueryChange: (value: string) => void
  view: ViewMode
  onViewChange: (view: ViewMode) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  filter: string
  onFilterChange: (filter: string) => void
  onNavigateRoot: () => void
  onNavigateFolder: (folderId: string) => void
  folderId: string | null
  onSearch: () => void
}) {
  const sortLabel =
    SORT_OPTIONS.find((option) => option.value === sort)?.label ?? "Name"

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {breadcrumb.length === 0 ? (
              <BreadcrumbPage>My files</BreadcrumbPage>
            ) : (
              <button
                type="button"
                onClick={onNavigateRoot}
                className="transition-colors hover:text-foreground"
              >
                My files
              </button>
            )}
          </BreadcrumbItem>
          {breadcrumb.map((folder, index) => {
            const last = index === breadcrumb.length - 1
            return (
              <React.Fragment key={folder.id}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {last ? (
                    <BreadcrumbPage>{folder.name}</BreadcrumbPage>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onNavigateFolder(folder.id)}
                      className="transition-colors hover:text-foreground"
                    >
                      {folder.name}
                    </button>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-wrap items-center gap-2">
        <InputGroup className="w-full sm:w-56">
          <InputGroupInput
            placeholder="Search files..."
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSearch()
            }}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <Select
          items={FILTER_OPTIONS}
          value={filter}
          onValueChange={(value) => onFilterChange(value as string)}
        >
          <SelectTrigger className="hidden w-40 md:flex">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {FILTER_OPTIONS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={<Button variant="outline" size="sm" />}
          >
            <ArrowDownUpIcon data-icon="inline-start" />
            {sortLabel}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => onSortChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToggleGroup
          value={[view]}
          onValueChange={(value) => value[0] && onViewChange(value[0] as ViewMode)}
          spacing={0}
          className="hidden sm:flex"
        >
          <ToggleGroupItem value="list" variant="outline" size="sm" aria-label="List view">
            <ListIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="grid" variant="outline" size="sm" aria-label="Grid view">
            <LayoutGridIcon />
          </ToggleGroupItem>
        </ToggleGroup>

        <FolderDialog parentId={folderId}>
          <Button variant="outline" size="sm">
            <FolderPlusIcon data-icon="inline-start" />
            <span className="hidden sm:inline">New folder</span>
          </Button>
        </FolderDialog>

        <FileUploadDialog parentId={folderId}>
          <Button size="sm">
            <UploadIcon data-icon="inline-start" />
            Upload
          </Button>
        </FileUploadDialog>
      </div>
    </div>
  )
}
