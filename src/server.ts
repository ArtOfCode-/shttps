import * as net from 'net';
import { Worker } from 'worker_threads';
import * as createDebug from 'debug';
import * as OptionParser from 'option-parser';
import HTTPResponse from './http_response';

const debug = createDebug('app:entry');
const parser = new OptionParser();
const options: { port?: number } = {};

parser.addOption('h', 'help', 'Display this help message')
      .action(parser.helpAction());
parser.addOption('p', 'port', 'Specify the port to listen on')
      .argument('PORT')
      .action(v => options.port = v);
parser.parse();

const server = net.createServer(async (c: net.Socket) => {
    // Read HTTP request
    // Send to worker
    // Receive message back, construct HTTP response
    // Send response back to client
    const worker = new Worker('./build/connect.js', { workerData: { request: '' } });

    const response: HTTPResponse = await new Promise((resolve: Function) => {
        worker.on('message', (message: { status: number, response: { plain?: string, file?: string, json?: any},
                                        options: { headers?: { [key: string]: string } } }) => {
            debug('Processed');
            resolve(new HTTPResponse(message.status, message.response, message.options));
        });
        worker.on('error', (err: Error) => {
            debug(`Errored: ${err.message}`);
            resolve(new HTTPResponse(500, { plain: err.message }));
        });
        worker.on('exit', (code: number) => {
            debug(`Exited: ${code}`);
            resolve(new HTTPResponse(500, { plain: `Exited with code ${code}` }));
        });
    });

    const message = await response.toString();
    c.write(message);
    c.destroy();
});

server.on('error', (err: Error) => {
    debug('Server errored:');
    debug(err.message);
    console.error(err);
});

server.listen(options.port || 4040, () => {
    debug(`Server listening on ${options.port || 4040}`);
});
