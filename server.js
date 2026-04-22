const express = require("express");
const { DatabaseSync } = require("node:sqlite");
const db = new DatabaseSync("./Chinook_Sqlite.sqlite");
const app = express();
app.use(express.json());

// Test route: list all tables in the database
app.get('/tables', (req, res) => {
const stmt = db.prepare(
"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
);
res.json(stmt.all());
});

// Test route: list all artists in the database
app.get('/artist', (req, res) => {
const stmt = db.prepare(
"SELECT * FROM Artist"
);
res.json(stmt.all());
});

// Testing using place holder in the URL 
app.get("/artists/:id/albums", (req, res) => {
const stmt = db.prepare(`
SELECT Album.AlbumId, Album.Title
FROM Album
WHERE Album.ArtistId = ?
`);
const albums = stmt.all(req.params.id);
if (albums.length === 0) {
return res.status(404).json({ error: "No albums found" });
}
res.json(albums);
});

//Testing for all the tracks
app.get('/track', (req, res) => {
const stmt = db.prepare(
"SELECT * FROM Track"
);
res.json(stmt.all());
});

//Testing all for albums
app.get('/album', (req, res) => {
const stmt = db.prepare(
"SELECT * FROM Album"
);
res.json(stmt.all());
});

//Testing for tracks longer than 5 minutes
app.get('/tracks/long', (req, res) => {
const stmt = db.prepare(
"SELECT Track.Name, Album.Title, Track.Milliseconds FROM Track JOIN Album ON Track.AlbumId = Album.AlbumId WHERE Track.Milliseconds > 300000"
);
res.json(stmt.all());
});

// Testing genre
app.get('/genre', (req, res) => {
const stmt = db.prepare(
"SELECT * FROM Genre"
);
res.json(stmt.all());
});

//Testing for number of tracks and average length of tracks for specific genres
app.get('/genres/:id/stats', (req, res) => {
    const genreId = req.params.id;
    const stmt = db.prepare(
    "SELECT COUNT(*) AS TrackCount, AVG(Track.Milliseconds) AS AvgTime, Genre.Name FROM Track JOIN Genre ON Track.GenreId = Genre.GenreId WHERE Genre.GenreId = ? GROUP BY Genre.Genreid"
    );
    res.json(stmt.get(genreId));
});

//Testing post for playlists
app.post('/playlists', (req, res) => {
    const stmt = db.prepare(
    "SELECT COUNT(*) AS TrackCount, AVG(Track.Milliseconds) AS AvgTime, Genre.Name FROM Track JOIN Genre ON Track.GenreId = Genre.GenreId WHERE Genre.GenreId = ? GROUP BY Genre.Genreid"
    );
    res.json(stmt.all());
});

app.listen(3000, () => {
console.log("Server running on http://localhost:3000");
});