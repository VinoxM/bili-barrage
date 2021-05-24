const request = require('request')

export function getUserInfoByCookie(uid: any, cookie: string) {
    return new Promise((resolve, reject) => {
        request(
            {
                url: 'https://api.bilibili.com/x/space/acc/info',
                headers: {cookie: cookie, 'Content-type': 'application/json'},
                qs: {mid: uid, jsonp: 'jsonp'},
                json: true
            }, (err: any, res: any, body: any) => {
                if (!err && body.code === 0) {
                    const data = body.data;
                    const userInfo = {
                        uname: data.name,
                        face: data.face,
                        sign: data.sign,
                        level: data.level
                    };
                    resolve(userInfo);
                } else reject(`获取用户信息失败:${err || body.message}`);
            })
    })
}

export function getUserStatByCookie(uid: any, cookie: string) {
    return new Promise((resolve, reject) => {
        request(
            {
                url: 'https://api.bilibili.com/x/relation/stat',
                headers: {cookie: cookie, 'Content-type': 'application/json'},
                qs: {vmid: uid, jsonp: 'jsonp'},
                json: true
            }, (err: any, res: any, body: any) => {
                if (!err && body.code === 0) {
                    const data = body.data;
                    const statInfo = {
                        follower: data.follower,
                        following: data.following
                    };
                    resolve(statInfo);
                } else reject(`获取粉丝信息失败:${err || body.message}`);
            })
    })
}

export function getRoomIdByCookie(cookie: string) {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.live.bilibili.com/xlive/web-ucenter/user/live_info',
            headers: {cookie: cookie, 'Content-type': 'application/json'},
            json: true
        }, (err: any, res: any, body: any) => {
            if (!err && body.code === 0) {
                const data = body.data;
                resolve(data.room_id);
            } else reject(`获取直播间ID失败:${err || body.message}`);
        })
    })
}

export function getUserLiveInfoByRoomId(roomId: any) {
    return new Promise((resolve, reject) => {
        roomId = Number.parseInt(String(roomId));
        request({
            url: 'https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomBaseInfo',
            qs: {'req_biz': 'link-center', 'room_ids': roomId},
            headers: {'Content-type': 'application/json'},
            json: true
        }, (err: any, res: any, body: any) => {
            if (!err && body.code === 0) {
                const data = body.data['by_room_ids'][roomId];
                resolve({
                    areaId: data.area_id,
                    areaName: data.area_name,
                    link: data.live_url,
                    status: data.live_status,
                    title: data.title
                });
            } else reject(`获取直播间信息失败:${err || body.message}`);
        })
    })
}

export function getLiveAreaList() {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.live.bilibili.com/room/v1/Area/getList',
            qs: {'show_pinyin': 1},
            headers: {'Content-type': 'application/json'},
            json: true
        }, (err: any, res: any, body: any) => {
            if (!err && body.code === 0) {
                const data = body.data;
                const liveArea: any = {}
                for (const item of data) {
                    for (const elem of item.list) {
                        liveArea[elem.id] = item.name + '-' + elem.name
                    }
                }
                resolve(liveArea);
            } else reject(`获取直播区域失败:${err || body.message}`)
        })
    })
}

export function updateLiveTitle(roomId: any, token: string, cookie: string, title: string) {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.live.bilibili.com/room/v1/Room/update',
            method: 'POST',
            form: {
                'room_id': roomId,
                title: title,
                'csrf_token': token,
                csrf: token
            },
            headers: {cookie: cookie}
        }, (err: any, res: any, body: any) => {
            if (!err && JSON.parse(body).code === 0) {
                resolve('保存成功');
            } else reject(`保存标题失败: ${err || JSON.parse(body).message}`);
        })
    })
}

export function updateLiveArea(roomId: any, token: string, cookie: string, areaId: any) {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.live.bilibili.com/room/v1/Room/update',
            method: 'POST',
            form: {
                'room_id': roomId,
                'area_id': areaId,
                'csrf_token': token,
                csrf: token
            },
            headers: {cookie: cookie}
        }, (err: any, res: any, body: any) => {
            if (!err && JSON.parse(body).code === 0) {
                resolve('保存成功');
            } else reject(`保存区域失败: ${err || JSON.parse(body).message}`);
        })
    })
}

export function updateLiveStatus(roomId: any, status: any, areaId: any, token: string, cookie: any) {
    const isLive = status || status === 1;
    return new Promise((resolve, reject) => {
        request({
            url: `https://api.live.bilibili.com/room/v1/Room/${!isLive ? 'startLive' : 'stopLive'}`,
            method: 'POST',
            form: {
                'room_id': roomId,
                'platform': 'pc',
                'area_v2': areaId,
                'csrf_token': token,
                csrf: token
            },
            headers: {cookie: cookie}
        }, (err: any, res: any, body: any) => {
            if (!err && JSON.parse(body).code === 0) {
                resolve(isLive ? '下播成功' : '开播成功');
            } else reject(`${isLive ? '下播失败' : '开播失败'}: ${err || JSON.parse(body).message}`);
        })
    })
}

export function getRtmpInfo(roomId: any, cookie: string) {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.live.bilibili.com/live_stream/v1/StreamList/get_stream_by_roomId',
            qs: {
                'room_id': roomId
            },
            headers: {cookie: cookie, 'Content-type': 'application/json'},
            json: true
        }, (err: any, res: any, body: any) => {
            if (!err && body.code === 0) {
                const data = body.data
                resolve(data.rtmp)
            } else reject(`获取直播流信息失败:${err || body.message}`)
        })
    })
}

export function getRealRoomId(roomId: any, cookie: string) {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.live.bilibili.com/room/v1/Room/room_init',
            qs: {id: roomId, cookie: cookie},
            headers: {cookie: cookie, 'Content-type': 'application/json'},
            json: true
        }, (err: any, res: any, body: any) => {
            if (!err && body.code === 0) {
                resolve(body.data.room_id);
            } else reject(`检测直播间ID失败:${err || body.message}`);
        })
    })
}

export function sendWsMessage(roomId: any, cookie: string, token: string, message: string) {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://api.live.bilibili.com/msg/send',
            form: {
                bubble: 0,
                msg: message,
                color: 16777215,
                mode: 1,
                fontsize: 25,
                rnd: 1621495631,
                roomid: roomId,
                csrf: token,
                csrf_token: token
            },
            method: 'POST',
            headers: {
                cookie: cookie
            }
        }, (err: any, res: any, body: any) => {
            const result = JSON.parse(body);
            if (!err && result.code === 0) {
                resolve(`发送弹幕:${message}`);
            } else reject(`发送弹幕失败:${err || result.message}`);
        })
    })
}
