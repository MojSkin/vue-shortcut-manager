import type { App, Plugin } from 'vue';
import { ShortcutManager } from './core/ShortcutManager';
import type { ShortcutDefinition, ShortcutAction, ShortcutCondition } from './types';

let globalManager: ShortcutManager | null = null;

export const ShortcutPlugin: Plugin = {
    install(app: App, options?: any) {
        globalManager = new ShortcutManager(app, options);
        app.config.globalProperties.$shortcuts = globalManager;
        app.provide('shortcutManager', globalManager);
        app.provide('shortcutHelp', () => globalManager?.getHelpHTML());
    }
};

export function getShortcutManager() {
    if (!globalManager) throw new Error('Plugin not installed');
    return globalManager;
}

export { useShortcutManager } from './composables/useShortcutManager';
export type { ShortcutDefinition, ShortcutAction, ShortcutCondition };