import { describe, it, expect } from 'vitest';
import { ShortcutManager } from '../src/core/ShortcutManager';
import { createApp } from 'vue';

describe('ShortcutManager', () => {
    it('should create instance', () => {
        const app = createApp({});
        const manager = new ShortcutManager(app);
        expect(manager).toBeDefined();
        expect(manager.registerGlobal).toBeTypeOf('function');
    });
});