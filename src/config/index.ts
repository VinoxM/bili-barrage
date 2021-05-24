import path from "path";

const fs = require('fs-extra')

export let config: any;

const source = path.join(__dirname, '../resource');

const confPath = path.join(source, 'config.json')

export function initConfig(): void {

    if (!fs.existsSync(source)) fs.mkdirsSync(source);

    if (!fs.existsSync(confPath)) {
        const {defaultConf} = require('./defaultConf');
        fs.writeJsonSync(confPath, defaultConf);
    }

    config = fs.readJsonSync(confPath);

    (global as any).config = config;
}

export function saveConfig(config: object): void {
    (global as any).config = config
    fs.writeJsonSync(confPath, config)
}
