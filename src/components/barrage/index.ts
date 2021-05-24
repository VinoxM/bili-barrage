import {
    Direction,
    QBoxLayout,
    QColor,
    QGraphicsDropShadowEffect,
    QLabel,
    QScrollArea,
    QWidget,
    ScrollBarPolicy,
    WidgetAttribute,
    WidgetEventTypes,
    WindowType
} from "@nodegui/nodegui";
import {addDragEvent} from "../../func/draggable";
import {scrollAreaCss} from "../../css/scroll";

let barr: any = []

export function createBarrage() {
    const panel = new QWidget();
    // panel.setWindowFlag(WindowType.Tool, true);
    panel.setWindowTitle('弹幕机');
    panel.setWindowFlag(WindowType.FramelessWindowHint, true);
    panel.setWindowFlag(WindowType.WindowStaysOnTopHint, true);
    panel.setAttribute(WidgetAttribute.WA_TranslucentBackground, true);
    panel.setFixedSize(400, 900);
    panel.setLayout(new QBoxLayout(Direction.TopToBottom));
    panel.layout?.setContentsMargins(0, 0, 0, 0);
    (global as any).barrage = panel;

    const view = new QWidget();
    view.setObjectName('view');
    view.setFixedSize(400, 900);
    view.setLayout(new QBoxLayout(Direction.TopToBottom));
    view.layout?.setContentsMargins(0, 0, 0, 0);
    view.layout?.setSpacing(5);
    panel.layout?.addWidget(view);

    const head = new QWidget();
    head.setObjectName('head');
    head.setStyleSheet('#head{border-bottom: 1px;border-color: #E6E6E6;border-style: solid;background-color: rgba(0,0,0,0.2);}');
    head.setFixedSize(400, 45);
    const effect = new QGraphicsDropShadowEffect();
    effect.setBlurRadius(8);
    effect.setXOffset(0);
    effect.setYOffset(0);
    effect.setColor(new QColor('#E6E6E6'));
    head.setGraphicsEffect(effect)
    view.layout?.addWidget(head);
    addDragEvent(panel, head, {width: panel.size().width(), height: panel.size().height()});

    const main = new QWidget();
    main.setFixedSize(400, 850);
    main.setLayout(new QBoxLayout(Direction.TopToBottom));
    main.layout?.setContentsMargins(0, 0, 0, 0);
    main.layout?.setSpacing(0);
    view.layout?.addWidget(main);

    const barrageArea = new QScrollArea();
    barrageArea.setFixedSize(400, 650);
    (global as any).barrageArea = barrageArea;
    barrageArea.addEventListener(WidgetEventTypes.Resize, ()=>{
        console.log('resize')
    })
    const barragePanel = new QWidget();
    barragePanel.setStyleSheet('background-color: rgba(0,0,0,0.1);border-color: #828790;border-width: 1px;border-style: solid')
    barragePanel.setLayout(new QBoxLayout(Direction.TopToBottom));
    barragePanel.layout?.setContentsMargins(0, 0, 0, 0);
    barragePanel.layout?.setSpacing(0);
    const barrage = new QWidget();
    barrage.setLayout(new QBoxLayout(Direction.TopToBottom));
    barrage.layout?.setContentsMargins(0, 0, 0, 0);
    barrage.layout?.setSpacing(5);
    (global as any).barragePanel = barrage;
    barragePanel.layout?.addWidget(barrage);
    const barrageSpace = new QWidget();
    barrageSpace.setFixedSize(390, 650);
    barragePanel.layout?.addWidget(barrageSpace);
    (global as any).barrageSpace = barrageSpace;

    barrageArea.setWidget(barragePanel);
    barrageArea.setWidgetResizable(true);
    barrageArea.setVerticalScrollBarPolicy(ScrollBarPolicy.ScrollBarAlwaysOn);
    barrageArea.setStyleSheet(scrollAreaCss(''));

    main.layout?.addWidget(barrageArea);

    panel.setStyleSheet(`
        #view {
            background-color: rgba(0,0,0,0.1);
        }
    `)
}

export function toggleBarrageVisible() {
    const panel = ((global as any).barrage as any);
    const barrageAction = ((global as any).barrageAction as any);
    !panel.isVisible() ? panel.show() : panel.hide();
    barrageAction.setChecked(panel.isVisible());
}

export function addBarrage(message: string) {
    console.log(message)
    const panel = (global as any).barragePanel;
    const label = new QLabel();
    label.setText(message);
    label.setFixedSize(390, 24);
    if (!panel) {
        barr.push(label);
    } else {
        if (barr.length > 0) {
            for (const elem of barr) {
                panel.layout?.addWidget(elem);
            }
            barr = [];
        }
        panel.layout?.addWidget(label);
        let count = panel.layout?.nodeChildren.size;
        let height = count * 29 - 5;
        if (height < 650) {
            (global as any).barrageSpace.setFixedSize(390, 650 - height);
        } else {
            (global as any).barrageSpace.hide();
        }
    }
}
