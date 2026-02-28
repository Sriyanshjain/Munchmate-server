const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const swiggyHeaders = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-IN,en;q=0.9',
    'Referer': 'https://www.swiggy.com/',
    'Origin': 'https://www.swiggy.com',
    'platform': 'dweb',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'Cookie': process.env.SWIGGY_COOKIE
};

app.get('/api/restaurants', (req, res) => {
    const { lat, lng } = req.query;
    const swiggyUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&page_type=DESKTOP_WEB_LISTING`;
    const url = `http://api.scraperapi.com?api_key=${process.env.SCRAPER_KEY}&url=${encodeURIComponent(swiggyUrl)}&render=false&keep_headers=true`;

    fetch(url, { headers: swiggyHeaders })
    .then(response => {
        console.log("Restaurants ScraperAPI status:", response.status);
        return response.text();
    })
    .then(text => {
        console.log("Restaurants raw response (first 200):", text.substring(0, 200));
        const json = JSON.parse(text);
        res.json(json);
    })
    .catch(error => {
        console.error("Restaurants error:", error.message);
        res.status(500).json({ error: error.message });
    });
});

app.get('/api/menu', (req, res) => {
    const { lat, lng, restaurantId } = req.query;
    const swiggyUrl = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${lng}&restaurantId=${restaurantId}&catalog_qa=undefined&submitAction=ENTER`;
    const url = `http://api.scraperapi.com?api_key=${process.env.SCRAPER_KEY}&url=${encodeURIComponent(swiggyUrl)}&render=false&keep_headers=true`;

    console.log("Fetching menu for restaurantId:", restaurantId);

    fetch(url, { headers: swiggyHeaders })
    .then(response => {
        console.log("Menu ScraperAPI status:", response.status);
        return response.text();
    })
    .then(text => {
        console.log("Menu raw response (first 200):", text.substring(0, 200));
        const json = JSON.parse(text);
        res.json(json);
    })
    .catch(error => {
        console.error("Menu error:", error.message);
        res.status(500).json({ error: error.message });
    });
});

app.get('/', (req, res) => {
    res.json({ "test": "hello Munchmate lovers !!!" });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
