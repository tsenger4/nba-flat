import { readJSON, writeJSON } from 'https://deno.land/x/flat/mod.ts'

const filename = Deno.args[0]
const data = await readJSON(filename)

const newfile = `${filename.replace(".json", "")}_parsed.json`
const data_minimal = data.league.standard.slice(0, 10);

await writeJSON(newfile, data_minimal);

const year = new Date().getFullYear();

for (var i in data_minimal) {

    let el = data_minimal[i]

    try {
        let fullName = `${el.firstName} ${el.lastName}`;
        let response = await fetch("https://www.balldontlie.io/api/v1/players?search=" + fullName);

        let obj = JSON.parse(await response.text());
        let id = obj.data[0].id;

        let response1 = await fetch("https://www.balldontlie.io/api/v1/stats?seasons[]=" + year + "&player_ids[]=" + id);
        let obj1 = JSON.parse(await response1.text());

        await writeJSON(`${el.teamSitesOnly.playerCode}.json`, obj1.data);
        await new Promise(r => setTimeout(r, 2000));
    }
    catch (err) {
        console.log("fetch failed", err);
    }
};