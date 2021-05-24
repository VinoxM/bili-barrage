import {QApplication, QMouseEvent, WidgetEventTypes} from "@nodegui/nodegui";

let winDraggable = false;
const mousePosition = {x: 0, y: 0};

// 启用拖动
export function addDragEvent(win: any,handler: any, size: any): void {
    handler.addEventListener(WidgetEventTypes.MouseButtonPress, (nativeEvent: any) => {
        const mouse = new QMouseEvent(nativeEvent);
        if (mouse.button() === 1) {
            // 打开拖动
            winDraggable = true;
            // 记录当前鼠标位置
            mousePosition.x = mouse.x();
            mousePosition.y = mouse.y();
        }
    });
    handler.addEventListener(WidgetEventTypes.MouseMove, (nativeEvent: any) => {
        if (winDraggable) {
            const mouse = new QMouseEvent(nativeEvent);
            win.move(mouse.globalX() - mousePosition.x, mouse.globalY() - mousePosition.y);
        }
    });
    handler.addEventListener(WidgetEventTypes.MouseButtonRelease, (nativeEvent: any) => {
        const mouse = new QMouseEvent(nativeEvent);
        if (mouse.button() === 1) {
            // 关闭拖动
            winDraggable = false;
            // 贴边
            const screen = QApplication.desktop().size();
            if (mouse.globalX() - mousePosition.x < 0) {
                win.move(0, win.pos().y);
            }
            if (mouse.globalX() - mousePosition.x > screen.width() - size.width) {
                win.move(screen.width() - size.width, win.pos().y);
            }
            if (mouse.globalY() - mousePosition.y < 0) {
                win.move(win.pos().x, 0);
            }
            if (mouse.globalY() - mousePosition.y > screen.height() - size.height) {
                win.move(win.pos().x, screen.height() - size.height);
            }
        }
    });
}

// 禁用拖动
export function removeDrag(win: any) {
    win.removeEventListener(WidgetEventTypes.MouseButtonPress);
    win.removeEventListener(WidgetEventTypes.MouseMove);
    win.removeEventListener(WidgetEventTypes.MouseButtonRelease);
}
