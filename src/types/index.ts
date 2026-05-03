export type KeyCombo = string; // e.g. "ctrl+s", "shift+tab", "f1"

export type ShortcutAction =
    | { type: 'navigate'; direction: 'next' | 'prev'; step?: number }
    | { type: 'call'; method: string; params?: any; scope?: 'component' | 'store' | 'global' }
    | { type: 'click'; selector: { by: 'id' | 'name' | 'class' | 'css'; value: string } }
    | { type: 'emit'; event: string; payload?: any };

export interface ShortcutCondition {
    focused?: string;          // selector of element that must be focused
    fieldValue?: { name: string; operator: '>' | '<' | '=='; value: any };
    mode?: 'edit' | 'new' | 'view';
    custom?: (context: any) => boolean;
}

export interface ShortcutDefinition {
    keys: KeyCombo[];          // multiple keys can trigger same action
    description: string;
    when?: ShortcutCondition;
    target: ShortcutAction;
    confirm?: string;          // confirmation message before executing
    showInHelp?: boolean;      // default true
    priority?: 'local' | 'global'; // local overrides global
}

export interface ShortcutContext {
    event: KeyboardEvent;
    component: any;            // Vue component instance (for methods/refs)
    store?: any;               // Pinia/Vuex store
    emit?: (event: string, ...args: any[]) => void;
    focusedElement: Element | null;
}