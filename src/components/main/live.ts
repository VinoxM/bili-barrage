import {
    AlignmentFlag,
    CursorShape,
    Direction,
    QBoxLayout,
    QComboBox,
    QGridLayout,
    QLabel,
    QLineEdit,
    QMouseEvent,
    QWidget,
    WidgetEventTypes
} from "@nodegui/nodegui";
import {ElemButton} from "../widgets/button";
import {
    getLiveAreaList,
    getRoomIdByCookie,
    getRtmpInfo,
    getUserLiveInfoByRoomId,
    updateLiveArea,
    updateLiveStatus,
    updateLiveTitle
} from "../../https";
import {changeWindowIcon} from "./index";
import {changeTrayIcon} from "../tray";
import {printLog} from "./log";
import {button as btnCss} from "../../css/button";

const {exec} = require('child_process');

const liveFrame: any = {};
(global as any).liveFrame = liveFrame;

const liveInfo: any = {
    roomId: 0,
    status: 0
};
(global as any).liveInfo = liveInfo;

let liveAreaInfo: any = {};

export function drawUserLiveInfo() {
    const liveInfoFrame_ = new QWidget();
    liveInfoFrame_.setLayout(new QBoxLayout(Direction.TopToBottom));
    liveInfoFrame_.setFixedSize(250, 200);
    liveInfoFrame_.layout?.setContentsMargins(2, 0, 2, 0);
    const liveInfoFrame = new QWidget();
    liveInfoFrame.setLayout(new QGridLayout());
    liveInfoFrame.setFixedSize(246, 200);
    liveInfoFrame.layout?.setContentsMargins(0, 0, 0, 0);
    liveInfoFrame.layout?.setSpacing(5);
    liveInfoFrame.setObjectName('live');
    liveInfoFrame.setStyleSheet(`
        #live {
            border-color: #828790;
            border-width: 1px;
            border-style: solid;
        }
    `);

    // Live Link
    const liveLinkFrame = new QWidget();
    liveLinkFrame.setFixedSize(240, 24);
    liveLinkFrame.setLayout(new QGridLayout());
    liveLinkFrame.layout?.setSpacing(0)
    liveLinkFrame.layout?.setContentsMargins(0, 0, 0, 0);
    const liveLinkLabel = new QLabel();
    liveLinkLabel.setFixedSize(35, 24);
    liveLinkLabel.setText('地址:');
    liveLinkLabel.setAlignment(AlignmentFlag.AlignVCenter);
    liveLinkFrame.layout?.addWidget(liveLinkLabel, 1, 1);
    const liveLink = new QLabel();
    liveLink.setFixedSize(205, 24);
    liveLink.setAlignment(AlignmentFlag.AlignVCenter);
    liveLink.setCursor(CursorShape.PointingHandCursor);
    liveLink.setText('<u>https://live.bilibili.com/?</u>');
    liveLink.setOpenExternalLinks(true);
    liveFrame.link = liveLink;
    liveLinkFrame.layout?.addWidget(liveLink, 1, 2);
    liveInfoFrame.layout?.addWidget(liveLinkFrame, 1, 1);

    // Live Title
    const liveTitleFrame = new QWidget();
    liveTitleFrame.setFixedSize(240, 24);
    liveTitleFrame.setLayout(new QGridLayout());
    liveTitleFrame.layout?.setSpacing(0);
    liveTitleFrame.layout?.setContentsMargins(0, 0, 0, 0);
    const liveTitleLabel = new QLabel();
    liveTitleLabel.setFixedSize(35, 24);
    liveTitleLabel.setText('标题:');
    liveTitleLabel.setAlignment(AlignmentFlag.AlignVCenter);
    liveTitleFrame.layout?.addWidget(liveTitleLabel, 1, 1);
    const liveTitle = new QLineEdit();
    liveTitle.setFixedSize(165, 24);
    liveFrame.title = liveTitle;
    liveTitleFrame.layout?.addWidget(liveTitle, 1, 2);
    const titleSaveBtn = ElemButton.normal({text: '保存', size: {width: 40, height: 24}, fontSize: 9}, () => {
        printLog('保存直播间标题')
        updateLiveTitle(liveInfo.roomId, (global as any).config.userInfo.token, (global as any).config.userInfo.cookie, liveTitle.text()).then((res: any) => {
            printLog(res);
            setTimeout(() => {
                updateLiveInfo();
            }, 800)
        }).catch(err => {
            printLog(err)
            setTimeout(() => {
                updateLiveInfo();
            }, 800)
        })
    })
    liveTitleFrame.layout?.addWidget(titleSaveBtn, 1, 3);
    liveInfoFrame.layout?.addWidget(liveTitleFrame, 2, 1);

    // Live Area
    const liveAreaFrame = new QWidget();
    liveAreaFrame.setFixedSize(240, 24);
    liveAreaFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    liveAreaFrame.layout?.setSpacing(0)
    liveAreaFrame.layout?.setContentsMargins(0, 0, 0, 0);
    const liveAreaLabel = new QLabel();
    liveAreaLabel.setFixedSize(35, 24);
    liveAreaLabel.setText('分区:');
    liveAreaLabel.setAlignment(AlignmentFlag.AlignVCenter);
    liveAreaFrame.layout?.addWidget(liveAreaLabel);
    const liveArea = new QComboBox();
    liveArea.setFixedSize(165, 24);
    liveFrame.area = liveArea;
    initLiveArea();
    liveAreaFrame.layout?.addWidget(liveArea);
    const areaSaveBtn = ElemButton.normal({text: '保存', size: {width: 40, height: 24}, fontSize: 9}, () => {
        printLog('保存直播区域')
        const index = liveArea.currentIndex();
        const areaId = Object.keys(liveAreaInfo)[index];
        updateLiveArea(liveInfo.roomId, (global as any).config.userInfo.token, (global as any).config.userInfo.cookie, areaId).then((res: any) => {
            printLog(res);
            setTimeout(() => {
                updateLiveInfo();
            }, 800)
        }).catch(err => {
            printLog(err);
            setTimeout(() => {
                updateLiveInfo();
            }, 800)
        })
    });
    liveAreaFrame.layout?.addWidget(areaSaveBtn);
    liveInfoFrame.layout?.addWidget(liveAreaFrame, 3, 1);

    // Live Status
    const liveStatusFrame = new QWidget();
    liveStatusFrame.setFixedSize(240, 24);
    liveStatusFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    liveStatusFrame.layout?.setSpacing(0);
    liveStatusFrame.layout?.setContentsMargins(0, 0, 0, 0);
    const liveStatusLabel = new QLabel();
    liveStatusLabel.setFixedSize(35, 24);
    liveStatusLabel.setAlignment(AlignmentFlag.AlignVCenter);
    liveStatusLabel.setText('状态:');
    liveStatusFrame.layout?.addWidget(liveStatusLabel, 1, 1);
    const liveStatus = ElemButton.info({text:'未开播',size:{width: 45,height:24},fontSize: 9},()=>{
        changeLiveStatus();
    });
    liveFrame.status = liveStatus;
    liveStatusFrame.layout?.addWidget(liveStatus, 1, 2);
    const liveStatusSpace = new QWidget()
    liveStatusSpace.setFixedSize(160, 24);
    liveStatusFrame.layout?.addWidget(liveStatusSpace, 1, 4);
    liveInfoFrame.layout?.addWidget(liveStatusFrame, 4, 1);

    // Live rtmp
    const liveRtmpFrame = new QWidget();
    liveRtmpFrame.setFixedSize(240, 24);
    liveRtmpFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    liveRtmpFrame.layout?.setSpacing(0);
    liveRtmpFrame.layout?.setContentsMargins(0, 0, 0, 0);
    liveFrame.rtmpItem = liveRtmpFrame;
    const liveRtmpLabel = new QLabel();
    liveRtmpLabel.setFixedSize(35, 24);
    liveRtmpLabel.setAlignment(AlignmentFlag.AlignVCenter);
    liveRtmpLabel.setText('rtmp:');
    liveRtmpFrame.layout?.addWidget(liveRtmpLabel);
    const liveRtmp = new QLabel();
    liveRtmp.setFixedSize(205, 24);
    liveRtmp.setAlignment(AlignmentFlag.AlignVCenter);
    liveRtmp.setCursor(CursorShape.PointingHandCursor);
    liveFrame.rtmp = liveRtmp;
    liveRtmp.addEventListener(WidgetEventTypes.MouseButtonPress, (nativeEvent: any) => {
        const mouse = new QMouseEvent(nativeEvent);
        if (mouse.button() === 1) {
            printLog('已复制直播流地址到剪贴板')
            exec('clip').stdin.end(liveRtmp.text());
        }
    })
    liveRtmpFrame.layout?.addWidget(liveRtmp);
    liveInfoFrame.layout?.addWidget(liveRtmpFrame, 5, 1);
    liveRtmpFrame.hide()

    // Live code
    const liveCodeFrame = new QWidget();
    liveCodeFrame.setFixedSize(240, 24);
    liveCodeFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    liveCodeFrame.layout?.setSpacing(0);
    liveCodeFrame.layout?.setContentsMargins(0, 0, 0, 0);
    liveFrame.codeItem = liveCodeFrame;
    const liveCodeLabel = new QLabel();
    liveCodeLabel.setFixedSize(35, 24);
    liveCodeLabel.setAlignment(AlignmentFlag.AlignVCenter);
    liveCodeLabel.setText('code:');
    liveCodeFrame.layout?.addWidget(liveCodeLabel);
    const liveCode = new QLabel();
    liveCode.setFixedSize(205, 24);
    liveCode.setAlignment(AlignmentFlag.AlignVCenter);
    liveCode.setCursor(CursorShape.PointingHandCursor);
    liveFrame.code = liveCode;
    liveCode.addEventListener(WidgetEventTypes.MouseButtonPress, (nativeEvent: any) => {
        const mouse = new QMouseEvent(nativeEvent);
        if (mouse.button() === 1) {
            printLog('已复制直播码到剪贴板')
            exec('clip').stdin.end(liveCode.text());
        }
    })
    liveCodeFrame.layout?.addWidget(liveCode);
    liveInfoFrame.layout?.addWidget(liveCodeFrame, 6, 1);
    liveCodeFrame.hide();

    // Live Space
    const liveSpaceItem = new QWidget();
    liveSpaceItem.setFixedSize(240, 57);
    liveInfoFrame.layout?.addWidget(liveSpaceItem, 6, 1);
    liveFrame.spaceItem = liveSpaceItem;

    liveInfoFrame_.layout?.addWidget(liveInfoFrame);
    return liveInfoFrame_;
}

function toggleLiveStatus() {
    printLog('更新直播状态')
    if (liveInfo.status || liveInfo.status === 1) {
        liveFrame.spaceItem.hide();
        liveFrame.rtmpItem.show();
        liveFrame.codeItem.show();
        liveFrame.status.setText('直播中');
        liveFrame.status.setStyleSheet(btnCss.success('btn','normal'));
        getRtmpInfo(liveInfo.roomId, (global as any).config.userInfo.cookie).then((res: any) => {
            liveFrame.rtmp.setText(`<u>${res.addr}</u>`);
            liveFrame.code.setText(`<u>${res.code}</u>`);
        }).catch(err => printLog(err))
    } else {
        liveFrame.rtmpItem.hide();
        liveFrame.codeItem.hide();
        liveFrame.spaceItem.show();
        liveFrame.status.setText('未开播');
        liveFrame.status.setStyleSheet(btnCss.info('btn','normal'));
    }
    const liveAction = (global as any).liveAction;
    if (!!liveAction) liveAction.setChecked(liveInfo.status === 1);
    changeWindowIcon(liveInfo.status === 1);
    changeTrayIcon(liveInfo.status === 1);
}

export function updateLiveInfo() {
    if (liveInfo.roomId === 0) {
        printLog('获取直播间号')
        getRoomIdByCookie((global as any).config.userInfo.cookie).then(roomId => {
            liveInfo.roomId = roomId;
            updateLiveInfo();
            // (global as any).wsRoom.setText(String(roomId));
            (global as any).wsRoom.setText('292891');
        }).catch(e => {
            printLog(e);
            drawDefaultLiveInfo();
        })
    } else {
        printLog('更新直播信息');
        getUserLiveInfoByRoomId(liveInfo.roomId).then((res: any) => {
            liveInfo.title = res.title;
            liveInfo.link = res.link;
            liveInfo.areaId = res.areaId;
            liveInfo.areaName = res.areaName;
            liveInfo.status = res.status;
            liveFrame.link.setText(`<a href="${res.link}"><u>${res.link}</u></a>`);
            liveFrame.title.setText(res.title);
            liveFrame.area.setCurrentText(liveAreaInfo[res.areaId] || res.areaName);
            toggleLiveStatus();
        }).catch(err => {
            printLog(err);
            drawDefaultLiveInfo();
        })
    }
}

function drawDefaultLiveInfo() {
    printLog('初始化直播信息')
    liveInfo.title = '';
    liveInfo.link = 'https://live.bilibili.com/?';
    liveInfo.areaId = 0;
    liveInfo.areaName = '';
    liveInfo.status = 0;
    liveFrame.link.setText(`<u>${liveInfo.link}</u>`);
    liveFrame.title.clear();
    liveFrame.area.setCurrentIndex(0);
    toggleLiveStatus();
}

function initLiveArea() {
    printLog('加载直播区域');
    getLiveAreaList().then((res: any) => {
        liveAreaInfo = res;
        liveFrame.area.clear();
        liveFrame.area.addItems(Object.values(res));
        if (!!liveInfo.areaId) {
            liveFrame.area.setCurrentText(liveAreaInfo[liveInfo.areaId]);
        }
    }).catch(err => printLog(err))
}

export function changeLiveStatus() {
    printLog('正在' + (liveInfo.status === 1 ? '下播' : '开播') + '...');
    updateLiveStatus(liveInfo.roomId, liveInfo.status, liveInfo.areaId, (global as any).config.userInfo.token, (global as any).config.userInfo.cookie).then((res: any) => {
        printLog(res)
        setTimeout(() => {
            updateLiveInfo();
        }, 800)
    }).catch(err => {
        printLog(err)
        setTimeout(() => {
            updateLiveInfo();
        }, 800)
    })
}
