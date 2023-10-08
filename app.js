require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const path = require('path');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')
const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
// Our routes go here:

app.get('/', (req, res) => {
    res.render('homepage')
})

app.get('/artistSearch', async(req, res)=>{
    try {
        const {artistName}  = req.query
        const data = await spotifyApi.searchArtists(artistName)
        //console.log(data.body.artists.items[0])
        const artistArray = data.body.artists.items
        const sortedArray = artistArray.sort((a, b)=> b.popularity - a.popularity).slice(0, 20)
        //console.log(artistArray[0])
        res.render('artistSearchResult', {artistArray: sortedArray})
    } catch (error) {
        console.log(error)
    }
})

app.get('/albums/:artistId', async(req, res)=>{
    const {artistId} = req.params
    const data = await spotifyApi.getArtistAlbums(artistId)
    const albumsArray = data.body.items
    //console.log(albumsArray[0])
    res.render('albums', {albumsArray})
})

app.get('/tracks/:albumId', async(req, res)=>{
    const {albumId} = req.params
    const data = await spotifyApi.getAlbumTracks(albumId)
    const tracksArray = data.body.items
    //console.log(tracksArray)
    res.render('tracks', {tracksArray})
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
