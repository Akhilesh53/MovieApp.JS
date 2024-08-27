import express from "express";
import bodyParser from "body-parser";
import { configDotenv } from "dotenv";

let app = express();

configDotenv();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('movie');
});

async function fetchMovieDetails(moviename) {
    const url = `https://advanced-movie-search.p.rapidapi.com/search/movie?query=${moviename}&page=1`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '00fca06c5cmshb84fe716bbdb379p1ba7a4jsn80d3cfeb16e3',
            'x-rapidapi-host': 'advanced-movie-search.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json(); // Parse the JSON response
        return result;
    } catch (error) {
        throw new Error(`Fetch error: ${error.message}`);
    }
}

app.get('/results', async (req, res) => {
    let query = req.query.search;

    try {
        let moviedetails = await fetchMovieDetails(query); // Await the promise
        //console.log(moviedetails);
        res.render('result', { movieDetails: moviedetails['results'], searchQuery: query });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
