import {printLog} from "../components/main/log";

const zlib = require("zlib");
const util = require("util");
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder('utf-8');
const pako = require('pako')

const inflateAsync = util.promisify(zlib.inflate);
const blank = Buffer.alloc(16);

function cutBuffer(buffer: any) {
    const bufferPacks = [];
    let size;
    for (let i = 0; i < buffer.length; i += size) {
        size = buffer.readInt32BE(i);
        bufferPacks.push(buffer.slice(i, i + size));
    }
    return bufferPacks;
}

/*export const decode = async (buffer: any) => {
    const packs: any = await Promise.all(cutBuffer(buffer)
        .map(async (buf) => {
            const body = buf.slice(16);
            const protocol = buf.readInt16BE(6);
            const operation = buf.readInt32BE(8);
            let type = 'unknow';
            if (operation === 3) {
                type = 'heartbeat';
            }
            else if (operation === 5) {
                type = 'message';
            }
            else if (operation === 8) {
                type = 'welcome';
            }
            let data;
            if (protocol === 0) {
                data = JSON.parse(String(body));
            }
            if (protocol === 1 && body.length === 4) {
                data = body.readUIntBE(0, 4);
            }
            if (protocol === 2) {
                data = await decode((await inflateAsync(body)));
            }
            return { buf, type, protocol, data };
        }));
    return packs.flatMap((pack: any) => {
        if (pack.protocol === 2) {
            return pack.data;
        }
        return pack;
    });
};*/

const readInt = function (buffer: any, start: any, len: any) {
    let result = 0
    for (let i = len - 1; i >= 0; i--) {
        result += Math.pow(256, len - i - 1) * buffer[start + i]
    }
    return result
}

const writeInt = function (buffer: any, start: any, len: any, value: any) {
    let i = 0
    while (i < len) {
        buffer[start + i] = value / Math.pow(256, len - i - 1)
        i++
    }
}

const decoder = function (blob: any) {
    let buffer = new Uint8Array(blob)
    let result: any = {}
    result.packetLen = readInt(buffer, 0, 4)
    result.headerLen = readInt(buffer, 4, 2)
    result.ver = readInt(buffer, 6, 2)
    result.op = readInt(buffer, 8, 4)
    result.seq = readInt(buffer, 12, 4)
    if (result.op === 5) {
        result.body = []
        let offset = 0;
        while (offset < buffer.length) {
            let packetLen = readInt(buffer, offset + 0, 4)
            let headerLen = 16// readInt(buffer,offset + 4,4)
            if (result.ver == 2) {
                let data = buffer.slice(offset + headerLen, offset + packetLen);
                let newBuffer = zlib.inflateSync(new Uint8Array(data));
                const obj = decoder(newBuffer);
                const body = obj.body;
                result.body = result.body.concat(body);
            } else {
                let data = buffer.slice(offset + headerLen, offset + packetLen);
                let body = textDecoder.decode(data);
                if (body) {
                    result.body.push(JSON.parse(body));
                }
            }
            // let body = textDecoder.decode(pako.inflate(data));
            // if (body) {
            //     result.body.push(JSON.parse(body.slice(body.indexOf("{"))));
            // }
            offset += packetLen;
        }
    } else if (result.op === 3) {
        result.body = {
            count: readInt(buffer, 16, 4)
        };
    }
    return result;
}

export const decode = function (blob: any) {
    return new Promise(function (resolve, reject) {
        const result = decoder(blob);
        resolve(result)
    });
}


export const encode = function (type: string, body: any) {
    if (typeof body !== 'string') {
        body = JSON.stringify(body);
    }
    const head = Buffer.from(blank);
    const buffer = Buffer.from(body);
    head.writeInt32BE(buffer.length + head.length, 0);
    head.writeInt16BE(16, 4);
    head.writeInt16BE(1, 6);
    if (type === 'heartbeat') {
        head.writeInt32BE(2, 8);
    }
    if (type === 'join') {
        head.writeInt32BE(7, 8);
    }
    head.writeInt32BE(1, 12);
    return Buffer.concat([head, buffer]);
}

encode.join = (roomId: number) => {
    return encode('join', {roomid: roomId});
}

encode.heartbeat = () => {
    return encode('heartbeat', '');
}
