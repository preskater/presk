"use client"

import * as React from "react"

import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs"
import { DownloadIcon, KeyRoundIcon, RotateCwIcon } from "lucide-react"

import { apiKeys, auditLog, tenants, users } from "@/lib/data"
import type { UserRole } from "@/lib/types"

const roleClass: Record<UserRole, string> = {
  admin: "border-primary/30 bg-primary/10 text-primary",
  editor: "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
  viewer: "border-muted-foreground/30 bg-muted text-muted-foreground",
}

export function Settings() {
  return (
    <div className="flex flex-col gap-4 px-4 py-4 md:py-6 lg:px-6">
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Administration & governance
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users & Roles</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
          <TabsTrigger value="tenants">Tenants</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>Role-based access control</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={roleClass[user.role]}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.tenant}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.lastLogin).toLocaleString("en-US")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="pt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Audit Log</CardTitle>
                  <CardDescription>Who did what, when</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <DownloadIcon />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLog.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          {entry.user}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {entry.action}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {entry.target}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {entry.tenant}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(entry.timestamp).toLocaleString("en-US")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tenants" className="pt-4">
          <div className="flex flex-col gap-3">
            {tenants.map((tenant) => (
              <Card key={tenant.id}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span
                      className="flex size-8 items-center justify-center rounded-lg text-sm font-semibold text-white"
                      style={{ backgroundColor: tenant.color }}
                    >
                      {tenant.logo}
                    </span>
                    <div className="flex flex-col">
                      <CardTitle>{tenant.name}</CardTitle>
                      <CardDescription>{tenant.domain}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <Label>Max agents</Label>
                    <Input defaultValue={String(tenant.maxAgents)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Max sessions/day</Label>
                    <Input defaultValue={String(tenant.maxSessionsPerDay)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Monthly budget ($)</Label>
                    <Input defaultValue={String(tenant.monthlyBudget)} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="security" className="pt-4">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>Rotation, revocation, scopes</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <KeyRoundIcon className="size-4 text-muted-foreground" />
                    <div className="flex flex-1 flex-col">
                      <span className="text-sm font-medium">{key.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {key.key}
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        key.status === "active"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }
                    >
                      {key.status}
                    </Badge>
                    <Button variant="ghost" size="icon-sm">
                      <RotateCwIcon />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Retention</CardTitle>
                <CardDescription>
                  Log and session deletion policy
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      Retention period
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Auto-delete logs and sessions after
                    </span>
                  </div>
                  <Select defaultValue="90">
                    <SelectTrigger size="sm" className="w-28">
                      <SelectValue placeholder="Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      Compliance export
                    </span>
                    <span className="text-xs text-muted-foreground">
                      SOC2, GDPR full log export
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    <DownloadIcon />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
