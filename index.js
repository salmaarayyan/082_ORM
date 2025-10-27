// Import express untuk membuat server
const express = require('express')
const app = express();
const PORT = 3000;

// Import folder models
const db = require("./models");

// Middleware untuk membaca data JSON dan form (POST body)
app.use(express.json());
app.use(express.urlencoded({ 
    extended: false
}));

// Jalankan server di port 3000
app.listen(PORT, () => {
    console.log('Server started on port 3000');
})

// Sinkronisasi model ke database (membuat tabel jika belum ada)
db.sequelize.sync()
    .then((result) => {
        // Jika sukses, jalankan server lagi (sebenarnya ini double listen)
        app.listen(3000, () => {
            console.log('Server started');
        })
    })
    .catch((err) => {
        // Jika gagal konek/sync ke database, tampilkan error
        console.log(err);
    })

// Endpoint untuk menambah data komik baru
app.post("/komik", async (req, res) => {
    const data = req.body;
    try {
        const komik = await db.Komik.create(data);
        res.send(komik);
    } catch (err) {
        res.send(err);
    }
});

// Endpoint untuk mendapatkan semua data komik
app.get('/komik', async (req, res) => {
    try {
        const komik = await db.Komik.findAll();
        res.send(komik);
    } catch (err) {
        res.send(err);
    }
});

// Endpoint untuk mengupdate data komik berdasarkan ID
app.put('/komik/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).send({ message: "Komik tidak ditemukan" });
        }

        await komik.update(data);
        res.send({message: "Komik berhasil diupdate", komik});
    } catch (err) {
        res.status(500).send(err);
    }
});


