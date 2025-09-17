import "@testing-library/jest-dom";
import { vi } from "vitest";

// Force override btoa/atob to handle unicode safely in tests
// Prevents InvalidCharacterError from native jsdom btoa
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.btoa = (str: string) => Buffer.from(str, "utf-8").toString("base64");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.atob = (b64: string) => Buffer.from(b64, "base64").toString("utf-8");

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
