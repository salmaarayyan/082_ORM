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
