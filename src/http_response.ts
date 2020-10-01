import HTTPCodes from './response_types';
import * as fs from 'fs';
import * as mime from 'mime-types';

export default class HTTPResponse {
    code: number;
    message: string;
    headers: { [key: string]: string } = {
        'Server': 'shttps',
        'X-Frame-Options': 'sameorigin',
        'X-Content-Type-Options': 'nosniff',
        'X-XSS-Protection': '1; mode=block'
    };

    _io?: Promise<string>;

    constructor (code: number, response: { plain?: string, file?: string, json?: any } = {}, options: { headers?: {} } = {}) {
        this.code = code;
        this.headers = Object.assign(this.headers, options.headers);
        if (response.plain) {
            this.headers['Content-Type'] = 'text/plain';
            this.message = response.plain;
        }
        else if (response.file) {
            this.headers['Content-Type'] = mime.contentType(response.file) || 'application/octet-stream';
            this._io = new Promise((resolve: Function, reject: Function) => {
                fs.readFile(response.file, (err: NodeJS.ErrnoException, data: Buffer) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    this.message = data.toString();
                    resolve(this.message);
                });
            });
        }
        else if (response.json) {
            this.headers['Content-Type'] = 'application/json';
            this.message = JSON.stringify(response.json);
        }
        else {
            this.code = 204;
            this.message = null;
        }
    }

    async toString() {
        const lines = [];
        lines.push(`HTTP/1.1 ${this.code} ${HTTPCodes[this.code]}`);
        Object.keys(this.headers).forEach(k => {
            lines.push(`${k}: ${this.headers[k]}`);
        });
        lines.push('');

        if (this._io) {
            const message = await this._io;
            lines.push(message);
        }
        else if (this.message) {
            lines.push(this.message);
        }

        return lines.join('\r\n');
    }
}