require('dotenv').config();
const Sheet = require('./sheet');
const fetch = require('node-fetch');

async function scrapePage(i) {
	const res = await fetch(
		`https://jobs.github.com/positions.json?page=${i}&search=`
	);
	const json = await res.json();

	const rows = json.map((job) => {
		return {
			COMPANY: job.company,
			TITLE: job.title,
			LOCATION: job.location,
			DATE: job.created_at,
			URL: job.url,
		};
	});

	return rows;
}

(async function () {
	let i = 1;
	let rows = [];

	while (true) {
		const newRows = await scrapePage(i);
		console.log('new row length', newRows.length);
		if (newRows.length === 0) break;
		rows = rows.concat(newRows);
		i++;
	}

	console.log('total rows length', rows.length);

	// filter by key words

	// convert date

	// sort by date

	console.log('filtered total rows length', rows.length);

	const sheet = new Sheet();
	await sheet.load();
	await sheet.addRows(rows);
})();
