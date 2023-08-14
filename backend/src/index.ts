import express from "express"
import type { Request, Response } from "express"
import cors from "cors"
import fs from "fs/promises"
import { z } from "zod"

const server = express()

server.use(cors())

type User = {
  id: number
  name: string
  age: number
}

const parse = (data: string): User[] => data
    .split("\n")
    .filter(row => !!row)
    .map(row => ({
      id: +row.split(",")[0],
      name: row.split(",")[1],
      age: +row.split(",")[2],
    }))

const stringify = (data: User[]): string => data
    .map(user => `${user.id},${user.name},${user.age}`)
    .join("\n")

const QuerySchema = z.object({
  name: z.string(),
})

// REST API - GET (method) /api/users (path) -> array
// GET /api/users?name=John   /api/users?age=30&name=John  -> array
server.get("/api/users", async (req: Request, res: Response) => {

  const userData = await fs.readFile("./database/users.txt", "utf-8")
  const users = parse(userData)

  const result = QuerySchema.safeParse(req.query)
  if (!result.success)
    return res.json(users)

  const query = result.data
  let filteredUsers = users.filter(user => user.name.includes(query.name))

  res.json(filteredUsers)
})

// GET /api/users/15 (id!!!!) path variable -> 1 object / HTTP404
server.get("/api/users/:id", async (req: Request, res: Response) => {
  const id = +req.params.id

  const userData = await fs.readFile("./database/users.txt", "utf-8")
  const users = parse(userData)
  let filteredUser = users.find(user => user.id === id)

  if (!filteredUser)
    return res.sendStatus(404)

  res.json(filteredUser)
})

const CreationSchema = z.object({
  name: z.string(),
  age: z.number(),
  id: z.number(),
})

// POST /api/users
server.post("/api/users", async (req: Request, res: Response) => {

  const result = CreationSchema.safeParse(req.body)
  if (!result.success)
    return res.sendStatus(400)

  const userData = await fs.readFile("./database/users.txt", "utf-8")
  const users = parse(userData)
  users.push({ name: result.data.name, age: result.data.age, id: Math.random() })
  await fs.writeFile("./database/users.txt", stringify(users), "utf-8")

  res.sendStatus(200)
})

const UpdateSchema = z.object({
  name: z.string().min(1).optional(),
  age: z.number().optional(),
})

// PATCH /api/users/15
server.patch("/api/users/:id", async (req: Request, res: Response) => {
  const id = +req.params.id
  const result = UpdateSchema.safeParse(req.body)
  if (!result.success)
    return res.sendStatus(400)

  const userData = await fs.readFile("./database/users.txt", "utf-8")
  const users = parse(userData)
  let filteredUser = users.find(user => user.id === id)
  if (filteredUser)
    return res.sendStatus(404)

  const updatedUsers: User[] = users.map(user => user.id === id ? {
    id,
    name: result.data.name || user.name,
    age: result.data.age === undefined ? user.age : result.data.age,
  } : user)
  
  await fs.writeFile("./database/users.txt", stringify(updatedUsers), "utf-8")

  res.sendStatus(200)
})

// DELETE /api/users/15 (id!!!!) path variable -> HTTP200
server.delete("/api/users/:id", async (req: Request, res: Response) => {
  const id = +req.params.id

  const userData = await fs.readFile("./database/users.txt", "utf-8")
  const users = parse(userData)
  let filteredUsers = users.filter(user => user.id !== id)

  await fs.writeFile("./database/users.txt", stringify(filteredUsers), "utf-8")

  res.sendStatus(200)
})

server.listen(3333)
