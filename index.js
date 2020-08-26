require('dotenv').config();
const moment = require('moment');
const Sheet = require('./sheet');
const fetch = require('node-fetch');

async function scrapePage(i) {
	const res = await fetch(
		`https://jobs.github.com/positions.json?page=${i}&search=remote`
	);
	const json = await res.json();

	const rows = json.map((job) => {
		return {
			COMPANY: job.company,
			TITLE: job.title,
			LOCATION: job.location,
			DATE: moment(job.created_at).format('L'),
			URL: job.url,
		};
	});

	return rows;
}

(async function () {
	let i = 1;
	let rows = [];

	// loop through all pages
	while (true) {
		const newRows = await scrapePage(i);

		if (newRows.length === 0) break;
		rows = rows.concat(newRows);

		i++;
	}

	const sheet = new Sheet();
	await sheet.load();
	await sheet.addRows(rows);
})();
