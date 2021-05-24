const defaultType = 'normal';
const defaultEffect = 'plain';

const colors = {
    normal: {
        color: {normal: '#606266', plain: '#606266'},
        border: {normal: '#dcdfe6', plain: '#dcdfe6'},
        background: {normal: '#fff', plain: '#fff'},
        hoverBorder: {normal: '#c6e2ff', plain: '#409eff'},
        hoverBackground: {normal: '#ecf5ff', plain: '#fff'},
    },
    primary: {
        color: {normal: '#fff', plain: '#409eff'},
        border: {normal: '#409eff', plain: '#b3d8ff'},
        background: {normal: '#409eff', plain: '#ecf5ff'},
        hoverBorder: {normal: '#66b1ff', plain: '#409eff'},
        hoverBackground: {normal: '#66b1ff', plain: '#409eff'},
    },
    success: {
        color: {normal: '#fff', plain: '#67c23a'},
        border: {normal: '#67c23a', plain: '#c2e7b0'},
        background: {normal: '#67c23a', plain: '#f0f9eb'},
        hoverBorder: {normal: '#85ce61', plain: '#67c23a'},
        hoverBackground: {normal: '#85ce61', plain: '#67c23a'},
    },
    info: {
        color: {normal: '#fff', plain: '#909399'},
        border: {normal: '#909399', plain: '#d3d4d6'},
        background: {normal: '#909399', plain: '#f4f4f5'},
        hoverBorder: {normal: '#a6a9ad', plain: '#909399'},
        hoverBackground: {normal: '#a6a9ad', plain: '#909399'},
    },
    warning: {
        color: {normal: '#fff', plain: '#e6a23c'},
        border: {normal: '#e6a23c', plain: '#f5dab1'},
        background: {normal: '#e6a23c', plain: '#fdf6ec'},
        hoverBorder: {normal: '#ebb563', plain: '#e6a23c'},
        hoverBackground: {normal: '#ebb563', plain: '#e6a23c'},
    },
    danger: {
        color: {normal: '#fff', plain: '#f56c6c'},
        border: {normal: '#f56c6c', plain: '#fbc4c4'},
        background: {normal: '#f56c6c', plain: '#fef0f0'},
        hoverBorder: {normal: '#f78989', plain: '#f56c6c'},
        hoverBackground: {normal: '#f78989', plain: '#f56c6c'},
    }
}

function elemButtonCss(name: string, type: string, effect: string): string {
    let isRound = effect === 'round';
    if (effect === 'round' || effect !== defaultEffect) effect = defaultEffect;
    if (Object.keys(colors).indexOf(type) === -1) type = defaultType;
    return `
            #${name} {
                color: ${(colors as any)[type].color[effect]};
                border: 1px solid ${(colors as any)[type].border[effect]};
                background-color: ${(colors as any)[type].background[effect]};
                border-radius: ${!isRound ? '4px' : '20px'};
            }
            #${name}:hover {
                color: ${type === 'normal' ? '#409eff' : '#fff'};
                border-color: ${(colors as any)[type].hoverBorder[effect]};
                background-color: ${(colors as any)[type].hoverBackground[effect]};
            }
        `
}


['normal', 'primary', 'success', 'info', 'warning', 'danger'].forEach((type) => {
    (elemButtonCss as any)[type] = (name: any, effect: string): string => elemButtonCss(name, type, effect)
})

export const button = elemButtonCss as any;
