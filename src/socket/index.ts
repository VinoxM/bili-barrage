import {printLog} from "../components/main/log";

import WebSocket from 'isomorphic-ws';

import {encode, decode} from './handler';
import {button as btnCss} from "../css/button";
import {getRealRoomId} from "../https";
import {addBarrage} from "../components/barrage";

let ws: any = null;
(global as any).ws = ws;
let internal: any = null;

export async function initSocket(roomId: any) {
    if (!!ws) {
        printLog('请先断开再连接')
        return
    }

    if (typeof roomId !== 'number') {
        roomId = parseInt(roomId);
    }

    let error = '';
    await getRealRoomId(roomId, (global as any).config.userInfo.cookie).then(res => {
        roomId = res;
    }).catch(err => {
        error = err
    })

    if (error !== '') {
        printLog(error)
        return
    }

    printLog(`连接到房间:${roomId}`);

    ws = new WebSocket('wss://broadcastlv.chat.bilibili.com/sub');

    ws.on('open', () => {
        ws.send(encode.join(roomId));
        const btn = (global as any).wsBtn;
        btn.setText('断开');
        btn.setStyleSheet(btnCss.danger('btn', 'normal'));
    })

    internal = setInterval(function () {
        ws.send(encode.heartbeat());
    }, 30000);

    ws.on('message', async (data: any) => {
            const packet: any = await decode(data).catch(err => {
                printLog('run error: ' + err)
            });
            // console.log(packet)
            switch (packet.op) {
                case 8:
                    printLog('加入房间');
                    break;
                case 3:
                    const count = packet.body.count
                    printLog(`人气：${count}`);
                    break;
                case 5:
                    packet.body.forEach((body: any) => {
                        switch (body.cmd) {
                            case 'DANMU_MSG':
                                addBarrage(`${body.info[2][1]}: ${body.info[1]}`);
                                break;
                            case 'SEND_GIFT':
                                printLog(`${body.data.uname} ${body.data.action} ${body.data.num} 个 ${body.data.giftName}`);
                                break;
                            case 'COMBO_SEND':
                                printLog(`${body.data.uname} ${body.data.action} ${body.data.combo_num} 个 ${body.data.gift_name}`);
                                break;
                            case 'WELCOME':
                                printLog(`欢迎 ${body.data.uname}`);
                                break;
                            case 'STOP_LIVE_ROOM_LIST':
                                break;
                            case 'NOTICE_MSG':
                                break;
                            case 'INTERACT_WORD':
                                addBarrage(`用户 ${body.data.uname} 进入直播间`);
                                break;
                            default:
                                console.log(body);
                        }
                    })
                    break;
                default:
                    console.log(packet);
            }
        }
    )

    ws.on('close', () => {
        printLog('连接已断开')
        const btn = (global as any).wsBtn;
        btn.setText('连接');
        btn.setStyleSheet(btnCss.normal('btn', 'normal'));
    })

}

export function closeSocket() {
    if (!ws) {
        printLog('未连接')
        return
    }
    ws.close();
    ws = null;
    clearInterval(internal);
}

export function toggleSocket(roomId: any) {
    const room = (global as any).wsRoom;
    if (!!ws && ws.readyState === 1) {
        closeSocket();
        room.setReadOnly(false);
    } else {
        initSocket(roomId).then(() => {});
        room.setReadOnly(true);
    }
}
