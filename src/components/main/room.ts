import {
    AlignmentFlag,
    Direction,
    QBoxLayout,
    QGridLayout,
    QLabel,
    QLineEdit,
    QTextEdit,
    QWidget
} from "@nodegui/nodegui";
import {ElemButton} from "../widgets/button";
import {closeSocket, initSocket, toggleSocket} from "../../socket";
import {sendWsMessage} from "../../https";
import {printLog} from "./log";
import {toggleBarrageVisible} from "../barrage";

export function createSpace() {
    const space_ = new QWidget();
    space_.setFixedSize(250, 110);
    space_.setLayout(new QBoxLayout(Direction.TopToBottom));
    space_.layout?.setContentsMargins(2, 0, 2, 6);
    space_.layout?.setSpacing(0);

    const space = new QWidget();
    space.setFixedSize(246, 110);
    space.setLayout(new QBoxLayout(Direction.TopToBottom));
    space.layout?.setContentsMargins(0, 0, 0, 0);
    space.layout?.setSpacing(4);
    space.setObjectName('space');
    space.setStyleSheet(`
        #space {
            border-color: #828790;
            border-width: 1px;
            border-style: solid;
        }
    `);

    space_.layout?.addWidget(space);

    const spaceFrame = new QWidget();
    spaceFrame.setFixedSize(246, 24);
    spaceFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    spaceFrame.layout?.setContentsMargins(3, 0, 3, 0);
    const spaceLabel = new QLabel();
    spaceLabel.setText('<u>弹幕机:</u>');
    spaceLabel.setFixedSize(240,24);
    spaceFrame.layout?.addWidget(spaceLabel)
    space.layout?.addWidget(spaceFrame);


    const linkFrame = new QWidget();
    linkFrame.setFixedSize(246, 24);
    linkFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    linkFrame.layout?.setContentsMargins(3, 0, 3, 0);
    linkFrame.layout?.setSpacing(5);
    const linkLabel = new QLabel();
    linkLabel.setText('直播间号:');
    linkLabel.setAlignment(AlignmentFlag.AlignVCenter);
    linkLabel.setFixedSize(65, 24);
    linkFrame.layout?.addWidget(linkLabel, 1, 1);
    const room = new QLineEdit();
    (global as any).wsRoom = room;
    room.setFixedSize(60, 24);
    linkFrame.layout?.addWidget(room);
    const connectBtn = ElemButton.normal({text: '连接', size: {width: 50, height: 24}, fontSize: 9}, () => {
        toggleSocket(room.text());
    });
    (global as any).wsBtn = connectBtn;
    linkFrame.layout?.addWidget(connectBtn);
    const barrageBtn = ElemButton.normal({text: '弹幕', size: {width: 50, height: 24}, fontSize: 9}, () => {
        toggleBarrageVisible();
    })
    linkFrame.layout?.addWidget(barrageBtn);

    space.layout?.addWidget(linkFrame);

    // const btnFrame = new QWidget();
    // btnFrame.setFixedSize(250, 24);
    // btnFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    // btnFrame.layout?.setContentsMargins(4, 0, 4, 0);
    // btnFrame.layout?.setSpacing(0);
    // const disconnectBtn = ElemButton.normal({text: '断开', size: {width: 60, height: 24}, fontSize: 9}, () => {
    //     closeSocket();
    // })
    // btnFrame.layout?.addWidget(disconnectBtn);
    // const barrageBtn = ElemButton.normal({text: '弹幕', size: {width: 60, height: 24}, fontSize: 9}, () => {
    //     toggleBarrageVisible();
    // })
    // btnFrame.layout?.addWidget(barrageBtn);
    // space.layout?.addWidget(btnFrame);

    const sendFrame = new QWidget();
    sendFrame.setFixedSize(246, 48);
    sendFrame.setLayout(new QGridLayout());
    sendFrame.layout?.setSpacing(5);
    sendFrame.layout?.setContentsMargins(3, 0, 3, 0);
    const send = new QTextEdit();
    send.setAcceptRichText(false);
    send.setFixedSize(185, 48);
    sendFrame.layout?.addWidget(send, 1, 1, 2);
    const sendBtn = ElemButton.normal({text: '发送', size: {width: 50, height: 24}, fontSize: 9}, () => {
        const message = send.toPlainText();
        if (message === '') return
        const userInfo = (global as any).config.userInfo
        printLog(`发送弹幕:${message}`)
        sendWsMessage(room.text(), userInfo.cookie, userInfo.token, message).then(() => {
            send.setText('');
        }).catch(err => printLog(err));
    })
    sendFrame.layout?.addWidget(sendBtn, 2, 2);
    space.layout?.addWidget(sendFrame);

    return space_;
}
