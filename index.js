const express = require('express')
const mysql = require('mysql2/promise')
const app = express()

app.use(express.json())

//db = DATABASE
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'escola'
})

app.get("/professores", async (req, res) => {
    const [professores] = await db.execute("SELECT * FROM professores")
    return res.json(professores)
})

app.post("/professores", async (req, res) => {
    const { nome } = req.body
    if (!nome) {
        return res.status(400).json({ error: "Nome não informado" })
    }

    if (nome.length < 2) {
        return res.status(400).json({ error: "Nome deve ter pelo menos 2 caracteres" })
    }

    const [result] = await db.execute("INSERT INTO professores (nome) VALUES (?)", [nome])
    return res.json({ id: result.insertId, nome })

})

app.post("/cursos", async (req, res) => {
    const { nome, professor_id } = req.body

    if (!nome || !professor_id) {
        return res.status(400).json({ error: "Nome e professor id são obrigatórios" })
    }

    const resultado = await
        db.execute("INSERT INTO cursos (nome, professor_id) VALUES (?, ?)", [nome, professor_id])

    return res.status(201).json({ id: resultado.insertId, nome })
})

app.listen(3000, () => console.log("API no ar :D"))