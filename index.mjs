import express from "express"
import cors from "cors"
import { validatePartialNote, validateNote } from "./schemas/lista.mjs";
import { PORT } from "/config.js"

const app = express()

//MIDDLEWARES
app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
   console.log(req.method)
   console.log(req.path)
   console.log(req.body)
   console.log(req.query)

   console.log("-----------")
   next()
})

let lista = [
   {
      id: 1,
      name: "Redisegned notifications",
      date: "Aug 10, 2024",
      type: "Not Important",
      description:
         "Customizing your notification settings is now easier than ever. Quickly change your settings using presets like Focused or Mentions only, or tailor them to fit your needs.",
   },
   {
      id: 2,
      name: "Bugs",
      date: "Jul 23, 2024",
      type: "Important",
      description:
         "In our continuous effort to make Hirefy the most reliable recruiting platform, we eliminate bugs in the platform! 🚫 Here's a summary of some of the major fixes:",
   },
   {
      id: 3,
      name: "Redisegned Logo",
      date: "Jul 15, 2024",
      type: "Not Important",
      description:
         "CWith the revamped Time Tracking interface, you get a streamlined design for easier, efficient time tracking. Track time directly from the menu bar and have admins record time for other users, ensuring total time-tracking control.",
   },
]

const hostname = "127.0.0.1"


//GETs
app.get("/", (req, res) => {
   res.send("<h1>Home</h1>")
})
app.get("/api/notes", (req, res) => {
   // If: "/api/notes?type=Not Important" we extract the type with req.query and filter, if not return all list
   const { type } = req.query
   if (type) {
      const filteredNotes = lista.filter(
         nota => nota.type.toLowerCase() === type.toLowerCase()
      )
      console.log(filteredNotes)
      return res.json(filteredNotes)
   }

   res.json(lista)
})
app.get("/api/notes/:id", (req, res) => {

   const id = Number(req.params.id)
   const item = lista.find((item) => item.id === id)
   if (item) {
      res.json(item)
   } else {
      res.status(404).end()
   }
})

//DELETE
app.delete("/api/notes/:id", (req, res) => {
   const id = Number(req.params.id)
   lista = lista.filter((item) => item.id !== id)
   res.status(204).end()
})

//POST
app.post("/api/notes", (req, res) => {

   const result = validatePartialNote(req.body)

   if (!result.success) {
      // 422 Unprocessable Entity
      return res.status(400).json({ error: JSON.parse(result.error.message) })
   }

   let item = req.body

   let ids = lista.map(note => note.id)
   let maxId = Math.max(...ids)

   let newItem = {
      id: maxId > 0 ? maxId + 1 : 1,
      date: new Date().toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      }),
      description: item.description,
      type: "Not Important",
      ...result.data
   }
   lista = [...lista, newItem]
   res.json(newItem)
})

//PATCH
app.patch('/api/notes/:id', (req, res) => {
   const result = validatePartialNote(req.body)

   if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
   }

   const { id } = req.params
   const noteIndex = lista.findIndex(note => note.id === Number(id))

   if (noteIndex === -1) {
      return res.status(404).json({ message: 'Note not found' })
   }

   const updateNote = {
      ...lista[noteIndex],
      ...result.data
   }

   lista[noteIndex] = updateNote

   return res.json(updateNote)
})

//404
app.use((req, res) => {
   res.status(404).json({
      error: "Not Found"
   })
})

app.listen(PORT, hostname, () => {
   console.log(`Server running at http://${hostname}:${PORT}/`)
})
