import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { randomUUID } from 'node:crypto';
import chalk from 'chalk';

// Random data generator
function* run() {
  for (let index = 0; index < 99; index++) {
    const DATA = {
      id: randomUUID(),
      name: `String-${index}`,
    };
    yield DATA;
  }
}

const HTTP_SERVER = createServer(async (req, res) => {
  console.log(chalk.green('REQUEST RECEIVED'));
  const readable = new Readable({
    read() {
      for (const data of run()) {
        // Every push is a chunk streaming
        this.push(`${JSON.stringify(data)}\n`);
      }
      // Sending empty chunk to end stream
      this.push(null);
      console.log(chalk.red('[SERVER]'), 'end of stream');
    },
  });
  readable.pipe(res);
});

HTTP_SERVER.listen(3333, () => {
  console.log('Server running');
});
