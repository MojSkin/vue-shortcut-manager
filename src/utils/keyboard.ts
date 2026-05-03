import {KeyCombo} from "../types";

export function normalizeKeyCombo(event: KeyboardEvent): string {
    const parts: string[] = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    if (event.metaKey) parts.push('meta');
    let key = event.key.toLowerCase();
    // normalize special keys
    if (key === ' ') key = 'space';
    if (key === 'arrowup') key = 'up';
    if (key === 'arrowdown') key = 'down';
    if (key === 'arrowleft') key = 'left';
    if (key === 'arrowright') key = 'right';
    parts.push(key);
    return parts.join('+');
}

export function matchesKeyCombo(event: KeyboardEvent, combo: KeyCombo): boolean {
    const normalizedEvent = normalizeKeyCombo(event);
    const normalizedCombo = combo.toLowerCase().replace(/arrow/g, '');
    return normalizedEvent === normalizedCombo;
}