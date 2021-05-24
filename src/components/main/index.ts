import {
    Direction,
    QBoxLayout, QGridLayout,
    QIcon,
    QMainWindow,
    QWidget,
    WidgetEventTypes,
    WindowState,
    WindowType
} from "@nodegui/nodegui";
import app_icon_stop from '../../../assets/app_icon_stop.png';
import app_icon from '../../../assets/app_icon.png';
import {hideTray} from "../tray";
import {drawUserInfo, updateUserInfo} from "./user";
import {drawUserLiveInfo, updateLiveInfo} from "./live";
import {createLogWindow} from "./log";
import {createSpace} from "./room";

export function createMainWindow(args: any): void {
    // Create Window
    const win = new QMainWindow();
    win.setObjectName('root');

    // Title
    win.setWindowTitle(args.title);

    // Icon
    const icon = new QIcon(app_icon_stop);
    win.setWindowIcon(icon)

    // Size
    win.setFixedSize(500, 400);


    const view = new QWidget(win);
    view.setFixedSize(500, 400);
    view.setLayout(new QGridLayout());
    view.layout?.setContentsMargins(0, 0, 0, 0);
    view.layout?.setSpacing(5);

    /* Show All Widgets' border;*/
    // win.setStyleSheet('border-color: #828790;border-width: 1px;border-style: solid')
    // win.setWindowFlag(WindowType.WindowStaysOnTopHint, true);

    // Draw User Info
    const userInfoFrame = drawUserInfo();
    view.layout?.addWidget(userInfoFrame,1,1);

    // Draw User Live Info
    const userLiveInfoFrame = drawUserLiveInfo();
    view.layout?.addWidget(userLiveInfoFrame,2,1);

    const logFrame = createLogWindow();
    view.layout?.addWidget(logFrame,1,2,3);

    // Draw Space
    const mainSpaceItem = createSpace();
    view.layout?.addWidget(mainSpaceItem,3,1);

    updateUserInfo();

    // Show
    win.show();

    // Before Close
    win.addEventListener(WidgetEventTypes.Close, () => {
        hideTray();
    });

    win.addEventListener(WidgetEventTypes.WindowStateChange, () => {
        if (win.windowState() === WindowState.WindowMinimized || win.windowState() === 9) {
            win.hide();
        }
    });

    (global as any).win = win;
}

export function toggleWindowVisible() {
    const win: any = (global as any).win;
    if (!win.isVisible()) {
        win.show();
        win.setWindowState(WindowState.WindowActive);
        win.activateWindow();
    } else win.hide();
}

export function changeWindowIcon(isLive: boolean) {
    (global as any).win.setWindowIcon(new QIcon(isLive ? app_icon : app_icon_stop));
    (global as any).barrage.setWindowIcon(new QIcon(isLive ? app_icon : app_icon_stop));
}
