import {
    QAction,
    QApplication,
    QIcon,
    QMenu,
    QSystemTrayIcon,
    QSystemTrayIconActivationReason
} from "@nodegui/nodegui";
import app_icon from "../../../assets/app_icon.png";
import app_icon_stop from "../../../assets/app_icon_stop.png";
import {toggleWindowVisible} from "../main";
import {toggleBarrageVisible} from "../barrage";
import {changeLiveStatus} from "../main/live";

export function createSystemTray(args: any) {
    // Icon
    const icon = new QIcon(app_icon_stop);

    // SystemTray
    const tray = new QSystemTrayIcon();
    tray.setIcon(icon);
    tray.setToolTip(args.title);

    // Double Click to Toggle window visible
    tray.addEventListener('activated', (activeEvent: any) => {
        const reason = activeEvent as QSystemTrayIconActivationReason;
        if (QSystemTrayIconActivationReason.DoubleClick === reason) {
            toggleWindowVisible()
        }
    })

    // Menu
    const menu = new QMenu();
    tray.setContextMenu(menu);

    // Toggle Live Status
    const liveAction = new QAction();
    const liveInfo: any = (global as any).liveInfo;
    liveAction.setText('Start Live');
    liveAction.addEventListener('triggered', () => {
        changeLiveStatus();
    })
    liveAction.setCheckable(true);
    liveAction.setChecked(liveInfo.status === 1);
    (global as any).liveAction = liveAction;
    menu.addAction(liveAction);

    // Toggle Barrage
    const barrageAction = new QAction();
    const panel: any = (global as any).barrage;
    barrageAction.setText('Show Barrage');
    barrageAction.addEventListener("triggered", () => {
        toggleBarrageVisible();
    });
    barrageAction.setCheckable(true);
    barrageAction.setChecked(panel.isVisible());
    (global as any).barrageAction = barrageAction;
    menu.addAction(barrageAction);

    // Exit
    const quitAction = new QAction();
    quitAction.setText("Exit");
    quitAction.addEventListener("triggered", () => {
        const app = QApplication.instance();
        tray.hide();
        app.exit(0);
    });
    menu.addAction(quitAction);

    // Show
    tray.show();
    (global as any).systemTray = tray;
}

export function hideTray() {
    const tray = (global as any).systemTray;
    tray.hide();
}

export function changeTrayIcon(isLive: boolean) {
    (global as any).systemTray.setIcon(new QIcon(isLive ? app_icon : app_icon_stop))
}
