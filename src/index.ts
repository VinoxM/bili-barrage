import {initConfig} from './config';

initConfig();

import {createMainWindow} from './components/main';
import {createBarrage} from "./components/barrage";
import {createSystemTray} from "./components/tray";

const args = {title: 'Bili直播管理'}

createMainWindow(args);

createBarrage();

createSystemTray(args);
