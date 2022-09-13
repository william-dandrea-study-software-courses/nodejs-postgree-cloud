const express = require('express');
const { Client } = require("pg");

const client = new Client({
    user: process.env.USER_DB,
    host: process.env.HOST_DB,
    database: process.env.DATABASE_NAME,
    password: process.env.PASSWORD_DB,
    port: process.env.PORT_DB
});

// ORM
const app = express();
const port = process.env.PORT || 5000;

async function createTable() {
    await client
        .query("CREATE TABLE if not exists search (id SERIAL PRIMARY KEY, name VARCHAR)")
        .then(async (payload) => {
            console.log(payload)
        }).catch(err => {
            console.log(err)
        })
}

app.get("/", async (req, res) => {

    const results = await client
        .query("INSERT INTO search(name) VALUES (NULL)")
        .then(async (payload) => {

            return await client
                .query("SELECT COUNT(*) FROM search")
                .then((payload2) => {
                    return payload2.rows;
                })
        })
        .catch(() => {
            throw new Error("Query failed");
        });

    res.setHeader("Content-Type", "application/json");
    res.status(200);
    res.send(JSON.stringify(results));
});


(async () => {
    await client.connect();

    await createTable();

    app.listen(port, () => {
        console.log(`Now listening on port ${port}`);
    });
})();

