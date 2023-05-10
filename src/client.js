import axios from "axios";
import chalk from "chalk";
import { Transform, Writable } from "node:stream";

const SERVER_URL = "http://localhost:3333";

const sendServerRequest = async () => {
	const RESPONSE = await axios.get(SERVER_URL, {
		method: "GET",
		responseType: "stream",
	});
	console.log(chalk.yellow("Sending GET to server"));
	return RESPONSE.data;
};

const SERVER_RESPONSE_DATA = await sendServerRequest();

SERVER_RESPONSE_DATA.pipe(
	// Handling the data stream
	new Transform({
		transform(chunk, encoding, callback) {
			const item = JSON.parse(chunk);
			const NUMERIC_PART = /\d+/.exec(item.name)[0];
			if (NUMERIC_PART % 2 === 0) item.name = item.name.concat(" é par");
			else item.name = item.name.concat(" é ímpar");
			callback(null, JSON.stringify(item));
		},
	}),
).pipe(
	new Writable({
		write(chunk, encoding, callback) {
			console.log(chalk.cyan("[RESPONSE]"), chunk.toString());
			callback();
		},
	}),
);
