import { inject, onMounted, onUnmounted, getCurrentInstance } from 'vue';
import type { ShortcutDefinition } from '../types';

export function useShortcutManager() {
    const manager = inject<any>('shortcutManager');
    const instance = getCurrentInstance();
    if (!manager || !instance) throw new Error('ShortcutManager not provided or no component instance');

    const register = (shortcuts: ShortcutDefinition[]) => {
        manager.registerLocal(instance.proxy, shortcuts);
    };

    const unregister = () => {
        manager.unregisterLocal(instance.proxy);
    };

    onMounted(() => {
        manager.updateActiveComponent(instance.proxy);
    });
    onUnmounted(() => {
        unregister();
    });

    return { register, unregister, manager };
}