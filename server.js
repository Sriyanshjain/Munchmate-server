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
    const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&page_type=DESKTOP_WEB_LISTING`;

    fetch(url, { headers: swiggyHeaders })
    .then(response => {
        console.log("Restaurants response status:", response.status);
        if (!response.ok) throw new Error(`Swiggy returned: ${response.status}`);
        return response.json();
    })
    .then(data => res.json(data))
    .catch(error => {
        console.error("Error details:", error.message);
        res.status(500).json({ error: error.message });
    });
});

app.get('/api/menu', (req, res) => {
    const { lat, lng, restaurantId } = req.query;
    const url = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${lng}&restaurantId=${restaurantId}&catalog_qa=undefined&submitAction=ENTER`;

    console.log("Fetching URL:", url);

    fetch(url, { headers: swiggyHeaders })
    .then(response => {
        console.log("Menu response status:", response.status);
        if (!response.ok) throw new Error(`Swiggy returned: ${response.status}`);
        return response.json();
    })
    .then(data => res.json(data))
    .catch(error => {
        console.error("Error details:", error.message);
        res.status(500).json({ error: error.message });
    });
});

app.get('/', (req, res) => {
    res.json({ "test": "hello Munchmate lovers !!!" });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
