const { Mutex } = require('async-mutex');

const mutex = new Mutex();

const WebSocketClient = require('websocket').w3cwebsocket;

const closeError = new Error('WebSocket was closed');

class PromisedWebSockets {
    constructor(disconnectedCallback) {
        /* CONTEST
        this.isBrowser = typeof process === 'undefined' ||
            process.type === 'renderer' ||
            process.browser === true ||
            process.__nwjs

         */
        this.client = undefined;
        this.closed = true;
        this.disconnectedCallback = disconnectedCallback;
    }

    async readExactly(number) {
        let readData = Buffer.alloc(0);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const thisTime = await this.read(number);
            readData = Buffer.concat([readData, thisTime]);
            number -= thisTime.length;
            if (!number) {
                return readData;
            }
        }
    }

    async read(number) {
        if (this.closed) {
            throw closeError;
        }
        await this.canRead;
        if (this.closed) {
            throw closeError;
        }
        const toReturn = this.stream.slice(0, number);
        this.stream = this.stream.slice(number);
        if (this.stream.length === 0) {
            this.canRead = new Promise((resolve) => {
                this.resolveRead = resolve;
            });
        }

        return toReturn;
    }

    async readAll() {
        if (this.closed || !await this.canRead) {
            throw closeError;
        }
        const toReturn = this.stream;
        this.stream = Buffer.alloc(0);
        this.canRead = new Promise((resolve) => {
            this.resolveRead = resolve;
        });

        return toReturn;
    }

    getWebSocketLink(ip, port, testServers, isPremium) {
    let zws2 = 'zws2.web.telegram.org';
    let zws1 = 'zws1.web.telegram.org';
    let zws2_1 = 'zws2-1.web.telegram.org';
    let zws1_1 = 'zws1-1.web.telegram.org';
    let zws4 = 'zws4.web.telegram.org';
    let zws4_1 = 'zws4-1.web.telegram.org';
    let zws3 = 'zws3.web.telegram.org';
    let zws5 = 'zws5.web.telegram.org';
        if (port === 443) {
               if (ip === zws2) {
              return `wss://domain:443/app1${testServers ? '_test' : ''}${isPremium ? '_premium' : ''}`;
    //        return `wss://${ip}:${port}/apiws${testServers ? '_test' : ''}${isPremium ? '_premium' : ''}`;

               }
               if (ip === zws1) {
                 return `wss://domain:443/update${testServers ? '_test' : ''}${isPremium ? '_premium' : ''}`;

               }
               if (ip === zws2_1) {
                 return `wss://domain:443/reload${testServers ? '_test' : ''}${isPremium ? '_premium' : ''}`;

               }
               if (ip === zws1_1) {
                 return `wss://domain:443/test${testServers ? '_test' : ''}${isPremium ? '_premium' : ''}`;

               }
               if (ip === zws4) {
                 return `wss://domain:443/get${testServers ? '_test' : ''}${isPremium ? '_premium' : ''}`;

               }
               if (ip === zws4_1) {
                 return `wss://domain:443/create${testServers ? '_test' : ''}${isPremium ? '_premium' : ''}`;

               }
               if (ip === zws3) {
                 return `wss://domain:443/delete${testServers ? '_test' : ''}${isPremium ? '_premium' : ''}`;

               }

               if (ip === zws5) {
                 return `wss://domain:443/push${testServers ? '_test' : ''}${isPremium ? '_premium' : ''}`;

               }


            return `wss://${ip}:${port}/apiws${testServers ? '_test' : ''}${isPremium ? '_premium' : ''}`;

        } else {
            return `ws://${ip}:${port}/apiws${testServers ? '_test' : ''}${isPremium ? '_premium' : ''}`;
        }
    }

    connect(port, ip, testServers = false, isPremium = false) {
        this.stream = Buffer.alloc(0);
        this.canRead = new Promise((resolve) => {
            this.resolveRead = resolve;
        });
        this.closed = false;
        this.website = this.getWebSocketLink(ip, port, testServers, isPremium);
        this.client = new WebSocketClient(this.website, 'binary');
        return new Promise((resolve, reject) => {
            this.client.onopen = () => {
                this.receive();
                resolve(this);
            };
            this.client.onerror = (error) => {
                // eslint-disable-next-line no-console
                console.error('WebSocket error', error);
                reject(error);
            };
            this.client.onclose = (event) => {
                const { code, reason, wasClean } = event;
                if (code !== 1000) {
                    // eslint-disable-next-line no-console
                    console.error(`Socket ${ip} closed. Code: ${code}, reason: ${reason}, was clean: ${wasClean}`);
                }

                this.resolveRead(false);
                this.closed = true;
                if (this.disconnectedCallback) {
                    this.disconnectedCallback();
                }
            };
            // CONTEST
            // Seems to not be working, at least in a web worker
            // eslint-disable-next-line no-restricted-globals
            self.addEventListener('offline', async () => {
                await this.close();
                this.resolveRead(false);
            });
        });
    }

    write(data) {
        if (this.closed) {
            throw closeError;
        }
        this.client.send(data);
    }

    async close() {
        await this.client.close();
        this.closed = true;
    }

    receive() {
        this.client.onmessage = async (message) => {
            await mutex.runExclusive(async () => {
                const data = message.data instanceof ArrayBuffer
                    ? Buffer.from(message.data)
                    : Buffer.from(await new Response(message.data).arrayBuffer());
                this.stream = Buffer.concat([this.stream, data]);
                this.resolveRead(true);
            });
        };
    }
}

module.exports = PromisedWebSockets;
