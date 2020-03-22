// =========================================
// Puerto
// =========================================
process.env.PORT = process.env.PORT || 3000;


// =========================================
// Entorno BD
// =========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://cafe-user:cafe-user123@cluster0-j6uxf.mongodb.net/cafe';
}

process.env.URLDB = urlDB;