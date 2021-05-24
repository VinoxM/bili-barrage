import {
    AlignmentFlag,
    CursorShape,
    Direction,
    QBoxLayout,
    QGridLayout,
    QLabel,
    QScrollArea,
    QWidget,
    ScrollBarPolicy,
    TextInteractionFlag
} from "@nodegui/nodegui";
import {scrollAreaCss} from "../../css/scroll";

let logs: string = '';

export function createLogWindow() {
    const logFrame = new QWidget();
    logFrame.setFixedSize(250, 400);
    logFrame.setLayout(new QBoxLayout(Direction.TopToBottom));
    logFrame.layout?.setContentsMargins(0, 0, 0, 0);
    logFrame.layout?.setSpacing(0);

    const logLabelFrame = new QWidget();
    logLabelFrame.setFixedSize(250, 24);
    logLabelFrame.setLayout(new QGridLayout());
    logLabelFrame.layout?.setSpacing(0);
    logLabelFrame.layout?.setContentsMargins(0, 0, 0, 0);
    logFrame.layout?.addWidget(logLabelFrame);

    const logLabel = new QLabel();
    logLabel.setText('日志:');
    logLabel.setFixedSize(40, 24);
    logLabelFrame.layout?.addWidget(logLabel, 1, 1);

    const logLabelSpace = new QWidget();
    logLabelSpace.setFixedSize(210, 24);
    logLabelFrame.layout?.addWidget(logLabelSpace, 1, 2);

    // const editLog = new QPlainTextEdit();
    // editLog.setFixedSize(250, 376);
    // editLog.setReadOnly(true);
    // editLog.setLineWrapMode(LineWrapMode.NoWrap);
    // editLog.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOn);
    // (global as any).editLog = editLog;

    const editLogFrame = new QScrollArea();
    editLogFrame.setFixedSize(250, 376);
    const editLog = new QLabel();
    editLog.setTextInteractionFlags(TextInteractionFlag.TextSelectableByMouse);
    editLog.setCursor(CursorShape.IBeamCursor);
    editLog.setMinimumSize(230, 19);
    editLog.setAlignment(AlignmentFlag.AlignTop);
    // editLog.setStyleSheet('border-color: black;border-width: 1px;border-style: solid');
    (global as any).editLog = editLog;
    editLogFrame.setWidget(editLog);
    editLogFrame.setStyleSheet(scrollAreaCss('border: 1px;border-style:solid;border-color: #828790;'));
    editLogFrame.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOn);
    logFrame.layout?.addWidget(editLogFrame, 2, 1);
    return logFrame;
}

export function printLog(text: string) {
    console.log(text);
    const LOG: any = (global as any).editLog;
    if (!LOG) {
        logs += text + '\n';
    } else {
        let logs_ = ''
        if (logs !== '') {
            logs += text;
            const arr = logs.split('\n');
            logs = '';
            arr.forEach((elem) => {
                logs_ += `<span style="line-height: 20px">${elem}</span><br>`
            })
        }
        logs_ = LOG.text() + `<span style="line-height: 20px">${text}</span><br>`;
        const height = (logs_.split('<br>').length - 1) * 14 + 5
        LOG.setText(logs_);
        LOG.setFixedSize(230, height);
        if (height > 380) {

        }
    }
}
