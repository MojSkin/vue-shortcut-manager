import type { App } from 'vue';
import type { ShortcutDefinition, ShortcutContext } from '../types';

export class ShortcutManager {
    private globalShortcuts: ShortcutDefinition[] = [];
    private localShortcutsMap = new WeakMap<object, ShortcutDefinition[]>(); // key: component instance
    private activeComponent: any = null;
    private listenerAttached = false;

    constructor(private app: App, private options?: any) {
        this.attachGlobalListener();
    }

    private attachGlobalListener() {
        if (this.listenerAttached) return;
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.listenerAttached = true;
    }

    private handleKeyDown(event: KeyboardEvent) {
        const combo = this.normalizeEventCombo(event);
        // 1. try local shortcuts (active component)
        let shortcut: ShortcutDefinition | undefined;
        if (this.activeComponent) {
            const locals = this.localShortcutsMap.get(this.activeComponent) || [];
            shortcut = locals.find(s => s.keys.some(k => this.matches(event, k)));
        }
        // 2. if not found, try global
        if (!shortcut) {
            shortcut = this.globalShortcuts.find(s => s.keys.some(k => this.matches(event, k)));
        }
        if (!shortcut) return;

        // check conditions
        if (!this.checkConditions(shortcut, event)) return;

        // confirmation
        if (shortcut.confirm && !confirm(shortcut.confirm)) return;

        // execute action
        this.executeAction(shortcut.target, event);
        event.preventDefault();
        event.stopPropagation();
    }

    private normalizeEventCombo(event: KeyboardEvent): string {
        // reuse from utils
        const { normalizeKeyCombo } = require('../utils/keyboard');
        return normalizeKeyCombo(event);
    }

    private matches(event: KeyboardEvent, combo: string): boolean {
        const { matchesKeyCombo } = require('../utils/keyboard');
        return matchesKeyCombo(event, combo);
    }

    private checkConditions(shortcut: ShortcutDefinition, event: KeyboardEvent): boolean {
        const cond = shortcut.when;
        if (!cond) return true;
        if (cond.focused) {
            const focused = document.activeElement;
            if (!focused || !focused.matches(cond.focused)) return false;
        }
        if (cond.fieldValue) {
            // simplistic: find input by name and check value
            const input = document.querySelector(`[name="${cond.fieldValue.name}"]`) as HTMLInputElement;
            if (!input) return false;
            const val = input.value;
            const numVal = parseFloat(val);
            switch (cond.fieldValue.operator) {
                case '>': if (!(numVal > cond.fieldValue.value)) return false; break;
                case '<': if (!(numVal < cond.fieldValue.value)) return false; break;
                case '==': if (val != cond.fieldValue.value) return false; break;
            }
        }
        if (cond.mode && this.activeComponent?.$options?.mode !== cond.mode) return false;
        if (cond.custom && !cond.custom({ event, component: this.activeComponent })) return false;
        return true;
    }

    private async executeAction(action: ShortcutDefinition['target'], event: KeyboardEvent) {
        const context: ShortcutContext = {
            event,
            component: this.activeComponent,
            store: this.activeComponent?.$store,
            emit: this.activeComponent?.$emit?.bind(this.activeComponent),
            focusedElement: document.activeElement,
        };
        switch (action.type) {
            case 'navigate':
                this.navigateFocus(action.direction, action.step || 1);
                break;
            case 'call':
                if (action.scope === 'component' && this.activeComponent && typeof this.activeComponent[action.method] === 'function') {
                    await this.activeComponent[action.method](action.params);
                } else if (action.scope === 'store' && context.store && typeof context.store[action.method] === 'function') {
                    await context.store[action.method](action.params);
                } else if (typeof (window as any)[action.method] === 'function') {
                    await (window as any)[action.method](action.params);
                }
                break;
            case 'click':
                const el = this.resolveElement(action.selector);
                if (el) (el as HTMLElement).click();
                break;
            case 'emit':
                if (context.emit) context.emit(action.event, action.payload);
                break;
        }
    }

    private resolveElement(selector: { by: string; value: string }): Element | null {
        switch (selector.by) {
            case 'id': return document.getElementById(selector.value);
            case 'name': return document.querySelector(`[name="${selector.value}"]`);
            case 'class': return document.querySelector(`.${selector.value}`);
            case 'css': return document.querySelector(selector.value);
            default: return null;
        }
    }

    private navigateFocus(direction: 'next' | 'prev', step: number) {
        const focusable = Array.from(document.querySelectorAll('input, button, textarea, select, [tabindex]:not([tabindex="-1"])'))
            .filter(el => (el as HTMLElement).offsetParent !== null && !(el as HTMLInputElement).disabled);
        const currentIndex = focusable.indexOf(document.activeElement!);
        let newIndex = currentIndex;
        if (direction === 'next') newIndex = Math.min(currentIndex + step, focusable.length - 1);
        else newIndex = Math.max(currentIndex - step, 0);
        if (newIndex !== currentIndex) (focusable[newIndex] as HTMLElement).focus();
    }

    // Public API
    registerGlobal(shortcut: ShortcutDefinition) {
        this.globalShortcuts.push(shortcut);
    }
    registerLocal(component: any, shortcuts: ShortcutDefinition[]) {
        this.localShortcutsMap.set(component, shortcuts);
        if (this.activeComponent === component) this.updateActiveComponent(component);
    }
    unregisterLocal(component: any) {
        this.localShortcutsMap.delete(component);
        if (this.activeComponent === component) this.activeComponent = null;
    }
    updateActiveComponent(component: any) {
        this.activeComponent = component;
    }
    getHelpHTML(component?: any): string {
        let shortcuts = [...this.globalShortcuts];
        if (component) {
            const locals = this.localShortcutsMap.get(component) || [];
            shortcuts = [...locals, ...shortcuts];
        }
        shortcuts = shortcuts.filter(s => s.showInHelp !== false);
        let html = '<div class="shortcut-help"><ul>';
        for (const sc of shortcuts) {
            const keys = sc.keys.map(k => `<kbd>${k}</kbd>`).join(', ');
            html += `<li>${keys} : ${sc.description}</li>`;
        }
        html += '</ul></div>';
        return html;
    }
}