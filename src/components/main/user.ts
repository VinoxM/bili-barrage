import {
    AlignmentFlag,
    AspectRatioMode,
    Direction,
    QBoxLayout,
    QGridLayout,
    QIcon,
    QLabel,
    QLineEdit,
    QPixmap,
    QTextEdit,
    QWidget,
    TransformationMode,
    WindowState,
    WindowType
} from "@nodegui/nodegui";
import request from 'request';
import avatar from '../../../assets/noface.jpg'
import user_setting from '../../../assets/user_setting.png'
import {getUserInfoByCookie, getUserStatByCookie} from "../../https";
import {ElemButton} from "../widgets/button";
import {saveConfig} from "../../config";
import {updateLiveInfo} from "./live";
import {printLog} from "./log";

const userFrame = {};
(global as any).userFrame = userFrame;

let userConf: any = (global as any).config.userInfo;

let settingPanel: any = null;

export function drawUserInfo() {
    const userInfoFrame_ = new QWidget();
    userInfoFrame_.setFixedSize(250, 80);
    userInfoFrame_.setLayout(new QBoxLayout(Direction.TopToBottom));
    userInfoFrame_.layout?.setSpacing(0);
    userInfoFrame_.layout?.setContentsMargins(2, 2, 2, 2)

    // User widget
    const userInfoFrame = new QWidget();
    userInfoFrame.setFixedSize(246, 76);
    userInfoFrame.setLayout(new QGridLayout());
    userInfoFrame.layout?.setSpacing(0);
    userInfoFrame.layout?.setContentsMargins(2, 2, 2, 2);
    userInfoFrame.setObjectName('user');
    userInfoFrame.setStyleSheet(`
        #user {
            border-color: #828790;
            border-width: 1px;
            border-style: solid;
        }
    `);

    // User Avatar
    const userAvatar = new QLabel();
    userAvatar.setFixedSize(72, 72);
    userAvatar.setAlignment(AlignmentFlag.AlignLeft);
    (userFrame as any).avatar = userAvatar;
    drawUserAvatarDefault();
    userInfoFrame.layout?.addWidget(userAvatar, 1, 1, 2)

    const userNameFrame = new QWidget();
    userNameFrame.setLayout(new QGridLayout());
    userNameFrame.layout?.setContentsMargins(5, 2, 0, 2);

    // User Name
    const userName = new QLabel();
    userName.setMaximumSize(110, 20);
    userName.setMinimumSize(70, 20);
    userName.setAlignment(AlignmentFlag.AlignVCenter);
    userName.setText('userName');
    (userFrame as any).name = userName;
    userNameFrame.layout?.addWidget(userName, 1, 1)

    // User Level
    const userLevel = new QLabel();
    userLevel.setFixedSize(50, 20);
    userLevel.setStyleSheet(LevelStyle[0]);
    userLevel.setAlignment(AlignmentFlag.AlignVCenter);
    userLevel.setAlignment(AlignmentFlag.AlignCenter);
    userLevel.setText('Level ?');
    (userFrame as any).level = userLevel;
    userNameFrame.layout?.addWidget(userLevel, 1, 2)

    userInfoFrame.layout?.addWidget(userNameFrame, 1, 2)

    const userFriendFrame = new QWidget();
    userFriendFrame.setLayout(new QGridLayout());
    userFriendFrame.layout?.setContentsMargins(5, 2, 0, 2);

    // User Follower
    const userFollowFrame = new QWidget();
    userFollowFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    userFollowFrame.layout?.setContentsMargins(0, 0, 0, 0);
    userFollowFrame.setFixedSize(80, 20);
    const userFollowLabel = new QLabel();
    userFollowLabel.setAlignment(AlignmentFlag.AlignVCenter);
    userFollowLabel.setFixedSize(35, 20);
    userFollowLabel.setText('关注:');
    userFollowFrame.layout?.addWidget(userFollowLabel);
    const userFollow = new QLabel();
    userFollow.setAlignment(AlignmentFlag.AlignVCenter);
    userFollow.setFixedSize(40, 20);
    userFollow.setText('?');
    userFollowFrame.layout?.addWidget(userFollow);
    (userFrame as any).follow = userFollow;
    userFriendFrame.layout?.addWidget(userFollowFrame, 1, 1);

    // User Fans
    const userFansFrame = new QWidget();
    userFansFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    userFansFrame.layout?.setContentsMargins(0, 0, 0, 0);
    userFansFrame.setFixedSize(80, 20);
    const userFansLabel = new QLabel();
    userFansLabel.setAlignment(AlignmentFlag.AlignVCenter);
    userFansLabel.setFixedSize(35, 20);
    userFansLabel.setText('粉丝:');
    userFansFrame.layout?.addWidget(userFansLabel);
    const userFans = new QLabel();
    userFans.setAlignment(AlignmentFlag.AlignVCenter);
    userFans.setFixedSize(40, 20);
    userFans.setText('?');
    (userFrame as any).fans = userFans;
    userFansFrame.layout?.addWidget(userFans);
    userFriendFrame.layout?.addWidget(userFansFrame, 1, 2);

    userInfoFrame.layout?.addWidget(userFriendFrame, 2, 2)

    // Setting panel
    settingPanel = createUserSettingWindow();

    // User setting
    const userBtnFrame = new QWidget();
    userBtnFrame.setFixedSize(170, 20);
    userBtnFrame.setLayout(new QGridLayout());
    userBtnFrame.layout?.setContentsMargins(5, 0, 0, 2);
    userBtnFrame.layout?.setSpacing(5);

    const userSettingBtn = ElemButton.normal({text: '配置', size: {width: 40, height: 20}, fontSize: 9}, () => {
        settingPanel.show();
        settingPanel.setWindowState(WindowState.WindowActive);
    });
    userBtnFrame.layout?.addWidget(userSettingBtn, 1, 1);
    const userRefreshBtn = ElemButton.normal({text: '刷新', size: {width: 40, height: 20}, fontSize: 9}, () => {
        updateUserInfo();
    });
    userBtnFrame.layout?.addWidget(userRefreshBtn, 1, 2);
    const testBtn = ElemButton.normal({text: '测试', size: [40, 20]}, () => {

    });
    userBtnFrame.layout?.addWidget(testBtn,1,3);
    const userSpace = new QWidget();
    userSpace.setFixedSize(30, 20);
    userBtnFrame.layout?.addWidget(userSpace, 1, 4);

    userInfoFrame.layout?.addWidget(userBtnFrame, 3, 2);

    userInfoFrame_.layout?.addWidget(userInfoFrame);
    return userInfoFrame_;
}

export function updateUserInfo() {
    printLog('更新用户信息')
    const frame = (global as any).userFrame;
    getUserInfoByCookie(userConf.uid, userConf.cookie).then((user: any) => {
        drawUserAvatar(user.face);
        frame.name.setText(user.uname);
        frame.level.setText('Level ' + user.level);
        frame.level.setStyleSheet(LevelStyle[user.level]);
        getUserStatByCookie(userConf.uid, userConf.cookie).then((stat: any) => {
            const follow = Number(stat.following), fans = Number(stat.follower);
            frame.follow.setText(changeFollowNum(follow));
            frame.fans.setText(changeFollowNum(fans));
            updateLiveInfo();
        }).catch(e => {
            printLog(e);
            drawDefaultUserInfo();
        });
    }).catch(e => {
        printLog(e);
        drawDefaultUserInfo();
    });
}

function drawDefaultUserInfo() {
    printLog('初始化用户信息');
    const frame = (global as any).userFrame;
    frame.name.setText('userName');
    frame.level.setText('?');
    frame.level.setStyleSheet(LevelStyle[0]);
    frame.follow.setText('?');
    frame.fans.setText('?');
    drawUserAvatarDefault();
}

function drawUserAvatar(url: any) {
    request({url, encoding: null}, (err, res, buffer) => {
        if (!err) {
            let qImage = new QPixmap();
            qImage.loadFromData(buffer);
            qImage = qImage.scaled(72, 72, AspectRatioMode.KeepAspectRatio, TransformationMode.SmoothTransformation);
            (global as any).userFrame.avatar.setPixmap(qImage);
        } else drawUserAvatarDefault();
    })
}

function drawUserAvatarDefault() {
    (global as any).userFrame.avatar.setPixmap(new QPixmap(avatar).scaled(72, 72, 1, 0));
}

const LevelStyle: any = {
    0: 'background-color:#bfbfbf; color: white',
    1: 'background-color:#bfbfbf; color: white',
    2: 'background-color:#95ddb2; color: white',
    3: 'background-color:#92d1e5; color: white',
    4: 'background-color:#ffb37c; color: white',
    5: 'background-color:#ff6c00; color: white',
    6: 'background-color:#ff0000; color: white'
}

function changeFollowNum(count: number) {
    return count > 10000 ? Number(count / 10000).toFixed(1) + 'W' : count
}

function createUserSettingWindow() {
    const panel = new QWidget();
    panel.setWindowFlag(WindowType.WindowMinimizeButtonHint, false);
    panel.setWindowTitle('用户信息配置');
    panel.setWindowIcon(new QIcon(user_setting));
    panel.setFixedSize(410, 179);
    panel.setLayout(new QGridLayout());
    panel.layout?.setContentsMargins(5, 0, 5, 0);
    panel.layout?.setSpacing(0);

    // panel.setStyleSheet('border-color: black;border-width: 1px;border-style: solid')

    const uidFrame = new QWidget();
    uidFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    uidFrame.layout?.setSpacing(5);
    uidFrame.layout?.setContentsMargins(0, 5, 0, 5);
    uidFrame.setFixedSize(400, 34);
    const uidLabel = new QLabel();
    uidLabel.setFixedSize(40, 24);
    uidLabel.setText('Uid:');
    uidLabel.setAlignment(AlignmentFlag.AlignVCenter);
    uidFrame.layout?.addWidget(uidLabel);
    const uid = new QLineEdit();
    uid.setFixedSize(120, 24);
    uid.setText(userConf.uid);
    uidFrame.layout?.addWidget(uid);
    const uidSpace = new QWidget();
    uidSpace.setFixedSize(230, 24);
    uidFrame.layout?.addWidget(uidSpace);

    panel.layout?.addWidget(uidFrame, 1, 1);

    const tokenFrame = new QWidget();
    tokenFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    tokenFrame.setFixedSize(400, 34);
    tokenFrame.layout?.setContentsMargins(0, 5, 0, 5);
    tokenFrame.layout?.setSpacing(5);
    const tokenLabel = new QLabel();
    tokenLabel.setAlignment(AlignmentFlag.AlignVCenter);
    tokenLabel.setText('Token:');
    tokenLabel.setFixedSize(40, 24);
    tokenFrame.layout?.addWidget(tokenLabel);
    const token = new QLineEdit();
    token.setFixedSize(240, 24);
    token.setText(userConf.token);
    tokenFrame.layout?.addWidget(token);
    const tokenSpace = new QWidget();
    tokenSpace.setFixedSize(110, 24);
    tokenFrame.layout?.addWidget(tokenSpace);

    panel.layout?.addWidget(tokenFrame, 2, 1);

    const cookieFrame = new QWidget();
    cookieFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    cookieFrame.layout?.setSpacing(5);
    cookieFrame.layout?.setContentsMargins(0, 5, 0, 5);
    cookieFrame.setFixedSize(400, 82);
    const cookieLabel = new QLabel();
    cookieLabel.setAlignment(AlignmentFlag.AlignVCenter);
    cookieLabel.setText('Cookie:');
    cookieLabel.setFixedSize(40, 24);
    cookieFrame.layout?.addWidget(cookieLabel);
    const cookie = new QTextEdit();
    cookie.setAcceptRichText(false);
    cookie.setFixedSize(355, 72);
    cookie.setText(userConf.cookie);
    cookieFrame.layout?.addWidget(cookie);

    panel.layout?.addWidget(cookieFrame, 3, 1);

    const saveBtnFrame = new QWidget();
    saveBtnFrame.setFixedSize(400, 29);
    saveBtnFrame.setLayout(new QBoxLayout(Direction.LeftToRight));
    saveBtnFrame.layout?.setContentsMargins(0, 0, 0, 5);
    const saveBtn = ElemButton.normal({text: '保存并刷新', size: {height: 24, width: 80}, fontSize: 9}, () => {
        const config = (global as any).config;
        userConf = {
            uid: uid.text(),
            token: token.text(),
            cookie: cookie.toPlainText()
        };
        config.userInfo = userConf;
        (global as any).liveInfo.roomId = 0;
        saveConfig(config);
        panel.close();
        updateUserInfo();
    })
    saveBtnFrame.layout?.addWidget(saveBtn);

    panel.layout?.addWidget(saveBtnFrame, 4, 1);

    return panel;
}
