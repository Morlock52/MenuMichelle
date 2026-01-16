import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: Record<string, unknown>;
}

function AllProviders({ children }: { children: React.ReactNode }) {
  // Add providers here as needed (e.g., ThemeProvider, StoreProvider)
  return <>{children}</>;
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
): ReturnType<typeof render> & { user: ReturnType<typeof userEvent.setup> } {
  const user = userEvent.setup();

  return {
    user,
    ...render(ui, { wrapper: AllProviders, ...options }),
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };
export { userEvent };

// Utility to wait for async operations
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

// Utility to create mock functions with type safety
export function createMockFn<T extends (...args: unknown[]) => unknown>() {
  return vi.fn() as unknown as T;
}

// Utility to simulate network delay
export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
