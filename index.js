global.qrcode = require("qrcode-terminal");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
global.fs = require("fs");

global.client = new Client({
	puppeteer: {
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	},
	authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
	qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
	console.log("Whatsapp Active!");
	await sendMsg();
});

client.initialize();

const message = `Whatsapp bulk message bot!"`;

function checkNumber(number) {
	if (isNaN(number)) return false;
	if (number.length != 12) return false;
	return true;
}

async function sendMsg() {
	const doc = await MessageMedia.fromFilePath("doc.pdf");
	const poster = await MessageMedia.fromFilePath("poster.jpeg");
	let numbers = fs.readFileSync("numbers.txt", "utf-8").split("\n");
	let sents = [];
	numbers.forEach(async (number) => {
		number = number.trim();
		if (sents.includes(number)) {
			return console.log(`Already sent: ${number}`);
		}
		try {
			sents.push(number);
			console.log(`Message sent to : ${number}`);
			// console.log(sents);
			await client.sendMessage(`${number}@c.us`, poster);
			await client.sendMessage(`${number}@c.us`, message);
			await client.sendMessage(`${number}@c.us`, doc);
			await timer(1000);
			
		} catch (e) {
			console.log(`Message failed to sent to : ${number}`);
		}
	});
}