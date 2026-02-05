# Web Testing Guide

This directory contains the test suite for the WRAP web application using Vue Test Utils and Vitest.

## Running Tests

```bash
# Run all web tests
dev test web

# Run specific test file and re-run on file change
dev test web web/tests/components/dashboards/DashboardSidebar.test.ts

# Run test and exit
dev test web -- --run web/tests/components/dashboards/DashboardSidebar.test.ts
```

## Test Structure

```
tests/
├── components/           # Component tests
│   └── dashboards/      # Dashboard component tests
├── factories/           # Test data factories
│   ├── dashboard-factory.ts
│   └── index.ts
├── support/             # Reusable test utilities and mocks
│   ├── directive-stubs.ts
│   ├── mock-current-user-api.ts
│   ├── mock-http-client.ts
│   ├── mock-router.ts
│   ├── mock-vuetify.ts
│   └── index.ts
├── utils/               # Utility tests
│   └── authorization-guards/
├── setup.ts            # Global test setup
├── tsconfig.json       # TypeScript configuration for tests
└── README.md           # This file
```

## Writing Tests

### Component Tests

Follow the backend testing patterns with Arrange-Act-Assert:

```typescript
import { mount, flushPromises } from "@vue/test-utils"
import { nextTick } from "vue"

import dashboardApi from "@/api/dashboards-api"
import workflowsApi from "@/api/workflows-api"

import { mockRouter, mockVuetify, directiveStubs } from "@/tests/support"
import { dashboardFactory } from "@/tests/factories"

import DashboardSidebar from "@/components/dashboards/DashboardSidebar.vue"

vi.mock("@/api/dashboards-api")
vi.mock("@/api/workflows-api")

describe("web/src/components/dashboards/DashboardSidebar.vue", () => {
  const vuetify = mockVuetify()
  const router = mockRouter([
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/dashboard",
      name: "DashboardPage",
      component: {
        template: "<div>Dashboard</div>",
      },
    },
  ])
  const dashboardApiMock = vi.mocked(dashboardApi)
  const workflowsApiMock = vi.mocked(workflowsApi)

  describe("DashboardSidebar", () => {
    describe("category selection behavior", () => {
      beforeEach(() => {
        workflowsApiMock.list.mockResolvedValue({
          workflows: [],
          totalCount: 0,
        })
      })

      test("when dashboards load, and category is valid, and is visible, category remains the same", async () => {
        // Arrange
        const dashboard1 = dashboardFactory.build({
          id: 1,
          slug: "waiting-on-me",
          workflowCount: 10,
        })
        const dashboard2 = dashboardFactory.build({
          id: 2,
          slug: "my-drafts",
          workflowCount: 5,
        })
        dashboardApiMock.list.mockResolvedValue({
          dashboards: [dashboard1, dashboard2],
          totalCount: 2,
        })

        // Act
        const wrapper = mount(DashboardSidebar, {
          props: {
            modelValue: "my-drafts",
          },
          global: {
            plugins: [vuetify, router],
            directives: directiveStubs,
          },
        })

        await flushPromises()
        await nextTick()

        // Assert
        expect(wrapper.emitted()).toEqual({
          "update:loaded": [[true]],
        })

        wrapper.unmount()
      })
    })
  })
})
```

### Using Factories

Factories provide realistic test data using Fishery and Faker.js (same as backend):

```typescript
import { dashboardFactory } from "@/tests/factories"

// Build a single dashboard with random data
const dashboard = dashboardFactory.build()

// Build with specific overrides
const customDashboard = dashboardFactory.build({
  slug: "my-drafts",
  workflowCount: 5
})

// Build multiple dashboards
const dashboards = dashboardFactory.buildList(3, { workflowCount: 10 })
```

Factories use Faker.js to generate realistic random data for fields like dates, colors, and counts. Override any field by passing it in the build options.

### Mocking APIs

```typescript
import dashboardApi from "@/api/dashboards-api"

vi.mock("@/api/dashboards-api")

const dashboardApiMock = vi.mocked(dashboardApi)

// Then in your test:
dashboardApiMock.list.mockResolvedValue({
  dashboards: [],
  totalCount: 0,
})
```

### Testing Component Events

Use `wrapper.emitted()` to test component event emissions:

```typescript
// Assert that specific events were emitted with expected values
expect(wrapper.emitted()).toEqual({
  "update:modelValue": [["waiting-on-me"]],
  "update:loaded": [[true]],
})

// Or check individual events
expect(wrapper.emitted("update:modelValue")).toBeTruthy()
expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["waiting-on-me"])
```

### Using beforeEach for Shared Setup

Use `beforeEach` to set up common mocks and state for related tests:

```typescript
describe("category selection behavior", () => {
  beforeEach(() => {
    workflowsApiMock.list.mockResolvedValue({
      workflows: [],
      totalCount: 0,
    })
  })

  test("first test case", async () => {
    // workflowsApiMock is already set up
  })

  test("second test case", async () => {
    // workflowsApiMock is already set up
  })
})
```

## Test Configuration

### Vite Configuration

The test environment is configured in `web/vite.config.js`:

- Environment: `jsdom`
- Globals: Enabled (no need to import `describe`, `test`, `expect`, etc.)
- CSS: Handled automatically with non-scoped class names
- Vuetify: Inlined for proper testing
- Setup file: `tests/setup.ts`
- Mock clearing: Enabled between tests

### Global Setup

`tests/setup.ts` includes:

- ResizeObserver polyfill (required by Vuetify)
- HTTP client mock
- Current user API mock

These are automatically available in all tests.

## Best Practices

1. **Use `test` not `it`**: Follow backend patterns for test blocks
2. **Full describe paths**: Use full file paths in describe blocks (e.g., `"web/src/components/..."`)
3. **Nested describes**: Group related tests with nested `describe` blocks for better organization
4. **Use Factories**: Create test data with Fishery factories instead of inline objects
5. **Use Support Utilities**: Import from `@/tests/support` for common setup
6. **Mock at Top Level**: Use `vi.mock()` at the top of test files, not inside tests
7. **Handle async properly**: Use `flushPromises()` and `nextTick()` for Vue reactivity
8. **Clean up**: Call `wrapper.unmount()` after each test
9. **Test User Behavior**: Focus on what the user sees and does, not implementation details
10. **Use Data Test IDs**: Add `data-testid` attributes for reliable element queries
11. **Test Events**: Use `wrapper.emitted()` to verify component event emissions
12. **Use beforeEach**: Set up common test state in `beforeEach` hooks for related tests

## References

- [Vuetify Testing Guide](https://vuetifyjs.com/en/getting-started/unit-testing/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Fishery Factory Pattern](https://github.com/thoughtbot/fishery)
