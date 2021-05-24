import {CursorShape, QCursor, QFont, QPushButton, QToolButton} from "@nodegui/nodegui";
import {button as buttonCss} from "../../css/button";

function elemButton(args: any, clickedCallback: any): QPushButton | QToolButton {
    let text: string, size: any, name: string = '', type: string = 'normal', effect: string = 'normal', fontSize = 9;
    if (typeof args === "object") {
        text = args.text;
        size = args.size;
        name = args.name || name;
        type = args.type || type;
        effect = args.effect || effect;
        fontSize = args.fontSize || fontSize;
    } else {
        text = args;
    }
    const btn = new QPushButton();
    const qFont = new QFont();
    qFont.setPointSize(fontSize);
    btn.setFont(qFont);
    btn.setText(text);
    btn.setFixedSize(size[0]||size?.width || 80, size[1]||size?.height || 40);
    btn.setObjectName(name || 'btn');
    btn.setCursor(new QCursor(CursorShape.PointingHandCursor));
    btn.setStyleSheet((buttonCss as any)[type](name || 'btn', effect));
    btn.addEventListener('clicked', clickedCallback);
    return btn;
}

['normal', 'primary', 'success', 'info', 'warning', 'danger'].forEach((type) => {
    (elemButton as any)[type] = (args: any, clickedCallback: any) => {
        if (typeof args === 'string') args = {text: args};
        args.type = type;
        return elemButton(args, clickedCallback);
    };
})

export const ElemButton = (elemButton as any);
