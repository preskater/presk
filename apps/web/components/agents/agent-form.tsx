"use client"

import * as React from "react"
import Link from "next/link"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Slider } from "@workspace/ui/components/slider"
import { Textarea } from "@workspace/ui/components/textarea"
import { ArrowLeftIcon, PlayIcon } from "lucide-react"

import { agents, models, tools } from "@/lib/data"

export function AgentForm() {
  const [name, setName] = React.useState("")
  const [role, setRole] = React.useState("")
  const [instructions, setInstructions] = React.useState("")
  const [model, setModel] = React.useState("gpt-4o")
  const [temperature, setTemperature] = React.useState([0.5])
  const [maxTokens, setMaxTokens] = React.useState("2048")
  const [timeout, setTimeout] = React.useState("30")
  const [selectedTools, setSelectedTools] = React.useState<string[]>([])
  const [selectedHandoffs, setSelectedHandoffs] = React.useState<string[]>([])
  const [testOutput, setTestOutput] = React.useState("")

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const toggleHandoff = (id: string) => {
    setSelectedHandoffs((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const runTest = () => {
    setTestOutput(
      `[sandbox] Running "${name || "Untitled agent"}" with ${model}...\n` +
        `> Hello! I'm ready to help. (temperature=${temperature[0]}, maxTokens=${maxTokens})`
    )
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          nativeButton={false}
          render={<Link href="/agents" />}
        >
          <ArrowLeftIcon />
        </Button>
        <div>
          <h2 className="text-lg font-semibold">Create Agent</h2>
          <p className="text-sm text-muted-foreground">Configure a new agent</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 @3xl/main:grid-cols-3">
        <div className="flex flex-col gap-4 @3xl/main:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Basic settings</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Support Assistant"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Customer Support"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="instructions">System instructions</Label>
                <Textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Describe how the agent should behave..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model & Parameters</CardTitle>
              <CardDescription>LLM configuration</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label>Model</Label>
                <Select
                  value={model}
                  onValueChange={(v) => setModel(v ?? "gpt-4o")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label>Temperature</Label>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {(temperature[0] ?? 0.5).toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={(v) => setTemperature(v as number[])}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="maxTokens">Max tokens</Label>
                  <Input
                    id="maxTokens"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="timeout">Timeout (s)</Label>
                  <Input
                    id="timeout"
                    value={timeout}
                    onChange={(e) => setTimeout(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tools</CardTitle>
              <CardDescription>Connect tools with scopes</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {tools.map((tool) => (
                <label
                  key={tool.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-3"
                >
                  <Checkbox
                    checked={selectedTools.includes(tool.id)}
                    onCheckedChange={() => toggleTool(tool.id)}
                  />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{tool.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {tool.category} · {tool.scopes.join(", ")}
                    </span>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Handoffs</CardTitle>
              <CardDescription>Route to other agents</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {agents.map((agent) => (
                <label
                  key={agent.id}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-3"
                >
                  <Checkbox
                    checked={selectedHandoffs.includes(agent.id)}
                    onCheckedChange={() => toggleHandoff(agent.id)}
                  />
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium">{agent.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {agent.role}
                    </span>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Instant Test</CardTitle>
              <CardDescription>Sandbox before deployment</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button variant="outline" onClick={runTest}>
                <PlayIcon />
                Run test
              </Button>
              {testOutput && (
                <pre className="rounded-lg bg-muted p-3 font-mono text-xs whitespace-pre-wrap">
                  {testOutput}
                </pre>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Model</span>
                <span className="font-medium">{model}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tools</span>
                <span className="font-medium">{selectedTools.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Handoffs</span>
                <span className="font-medium">{selectedHandoffs.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedTools.map((id) => {
                  const t = tools.find((x) => x.id === id)
                  return (
                    <Badge key={id} variant="secondary">
                      {t?.name}
                    </Badge>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">Deploy Agent</Button>
        </div>
      </div>
    </div>
  )
}
