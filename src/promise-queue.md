# `PromiseQueue<T>`

Socket's accept queue with buffered pending connections:

```ts
type Acceptor = (remote: RTCSessionDescription) => Promise<RTCSessionDescription>;

export class Server {
    _server!: http.Server;

    async listen(
        httpControlPort: number,
        httpControlPath: string = '/pre_connect',
    ) {
        const server = this._server = http.createServer(async (req, res) => {
            if (req.url !== httpControlPath) return;
            if (req.method !== 'POST') return;

            const payload: RTCSessionDescription = await new Promise(rslv => {
                let data = '';

                req.on('data', chunk => {
                    data += chunk;
                })
                req.on('end', () => {
                    rslv(JSON.parse(data));
                });
            });

            const accept = await this._pendingPreConnects.pop();
            const response = await accept(payload);

            res.write(JSON.stringify(response));
            res.end();
        });

        return new Promise(rslv => {
            server.once('listening', () => {
                rslv();
            });
    
            server.listen(httpControlPort);  
        });
    }

    _pendingPreConnects = new PromiseQueue<Acceptor>();

    accept() {
        return new Promise<RemoteConnectionListener>(rslv => {
            this._pendingPreConnects.push(async remoteSDP => {
                const rcl = new RemoteConnectionListener();
                const localSDP = await rcl.listen(remoteSDP);
                rslv(rcl);
                return localSDP;
            });
        });
    }
}
```