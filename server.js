const express = require('express');
const cors = require('cors');
const fetch = require('cross-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.get('/api/restaurants', (req, res) => {
    const { lat, lng } = req.query;
    const swiggyUrl = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${lat}&lng=${lng}&page_type=DESKTOP_WEB_LISTING`;
    const url = `http://api.scraperapi.com?api_key=${process.env.SCRAPER_KEY}&url=${encodeURIComponent(swiggyUrl)}`;

    fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
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
    const swiggyUrl = `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=${lat}&lng=${lng}&restaurantId=${restaurantId}&catalog_qa=undefined&submitAction=ENTER`;
    const url = `http://api.scraperapi.com?api_key=${process.env.SCRAPER_KEY}&url=${encodeURIComponent(swiggyUrl)}`;

    console.log("Fetching URL:", swiggyUrl);

    fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        console.log("Swiggy response status:", response.status);
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
