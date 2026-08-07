# AGENTS.md

Instructions for AI coding agents working in this repository.

Read this file before your first edit. If something here conflicts with a direct
instruction from a maintainer, the maintainer wins — but say out loud which rule
you're setting aside and why.

---

## 1. What Omnira is

Omnira turns idle devices into a decentralized global computing network.

The product has two sides, and almost every screen belongs to one of them:

**Contribute** — people connect their everyday hardware (laptops, desktops,
servers, phones) to the network, earn from unused capacity, watch device
activity and performance, and control exactly when their hardware participates.

**Deploy** — people ship websites, APIs, applications, and AI models onto that
distributed infrastructure instead of a traditional cloud provider.

Whenever you're unsure who a screen is for, ask which of those two jobs it
serves. If it serves neither, it probably shouldn't exist yet.

### Mission

> Build a decentralized global computing network by transforming the world's
> idle devices into secure, productive infrastructure — empowering people to
> earn from their existing hardware while advancing a more efficient and
> innovative internet.

### Themes that should be visible in the product

| Theme | What it means on screen |
| --- | --- |
| **Decentralization** | Millions of devices, not a handful of data centers. Show breadth, distribution, and geography. |
| **Resource utilization** | Idle capacity becoming useful. Show the before/after, the reclaimed waste. |
| **Empowerment** | The user is in control and gets paid. Never bury earnings, never hide the off switch. |
| **Innovation** | A new model for delivering compute. The interface should feel like infrastructure, not a crypto dashboard. |

These are also copy constraints. Write to them; don't quote them at the user.

---

## 2. Stack and ground rules

- **Next.js (App Router) + React + TypeScript.** No other frameworks.
- **Frontend only.** There is no backend and you are not to build one. See §5.
- **Strict typing.** No `any`, no `@ts-ignore`, no `as` casts used to silence the
  compiler. If a type is genuinely unknown, model it as `unknown` and narrow.
- **No new dependencies** without a one-line justification in your summary. Reach
  for the platform and what's already installed first. A 40-line utility beats a
  new package.
- **Server Components by default.** Add `"use client"` only at the leaf that
  actually needs interactivity, state, or browser APIs — never at a route root
  as a convenience.

### Repository layout

Follow the structure that already exists. Where you're adding something new,
this is the shape:

```
app/                 # routes, layouts, loading.tsx, error.tsx, not-found.tsx
components/
  ui/                # primitives: Button, Card, Badge, Input, Table
  <feature>/         # feature-scoped composites
lib/
  api/               # service functions — the only place fetch/mock data lives
  utils/             # pure helpers
hooks/               # reusable client-side state and data hooks
types/               # shared data models, mirroring expected backend schemas
brand_assets/        # pre-redesign site + brand reference (it is a image)
```

Rules that follow from this:

- Components receive data through **props or hooks**. A component never imports
  from `lib/api/` mock data directly.
- Anything reused twice becomes a component or hook. Anything reused three times
  and still copy-pasted is a bug.
- Colocate a component's types with it; promote to `types/` only when shared.

---

## 3. Before you change anything

Do these four things first, every session. They take minutes and prevent most
rework.

1. **Read the repo.** Existing conventions beat your defaults, including the
   conventions in this file. Match the naming, the import style, the file
   layout you find.
2. **Check `brand_assets/`.** It contains the original site from before the
   redesign. It is the reference for palette, wordmark, voice, and existing
   product vocabulary. Reinterpret it — don't reproduce it, and don't ignore it.
3. **Confirm the approach fits.** If the approved plan assumes something the
   codebase doesn't have, say so before writing code.
4. **Name blockers early.** Missing requirements, ambiguous flows, and
   undecided data shapes get raised at the start, not in the summary.

---

## 4. Design

Use the **`frontend-design`** skill for every layout, component, and UI pattern
decision. It is not optional and it is not a final polish pass — consult it
while you're planning, before you write JSX.

Non-negotiables for this product:

- **One design system, applied consistently.** A single spacing scale, a single
  type scale, one set of semantic color tokens, one radius scale. Define tokens
  once; never hardcode a hex or a pixel value in a component.
- **Production quality, not a wireframe.** Real density, real states, real
  empty screens. "Placeholder-looking" is a defect.
- **Responsive at desktop, tablet, and mobile.** Design the mobile layout
  deliberately; a squeezed desktop grid isn't a mobile design. Dashboards and
  data tables need a real small-screen answer.
- **Every async surface ships three states**: loading (skeletons that match the
  final layout — not spinners), error (what happened and what to do next), and
  empty (an invitation to act, not an apology).
- **Accessibility is part of done**: semantic elements over `div`s, labels tied
  to inputs, visible keyboard focus, contrast that passes AA, `aria-live` for
  values that update on their own, `prefers-reduced-motion` respected.

### Writing in the interface

Copy is design material. Same care as spacing.

- Name things by what the user controls, not how the system works. People pause
  a device; they don't "toggle the node scheduler daemon."
- Active voice, sentence case, plain verbs. A button says what happens:
  "Start contributing," not "Submit."
- A name survives the whole flow. The button that says "Deploy" produces a toast
  that says "Deployed."
- Errors don't apologize and are never vague. Say what broke and the next move.
- Money and performance numbers are the emotional core of this product. Format
  them consistently, label their period and units, and never round away
  something the user would care about.

---

## 5. Backend policy

**Do not implement a backend.** Assume one arrives later. Your job is to make
that arrival a small diff.

- Every piece of data comes from a **service function in `lib/api/`** with the
  signature a real endpoint would have — async, argument-taking, returning a
  typed promise, and capable of failing.
- Mock responses **match expected backend schemas**, including pagination
  wrappers, timestamps, IDs, and error shapes. Mock data lives beside the
  service, never inside a component or a page.
- Swapping a mock for a real `fetch` should touch **one file** and no components.
- Model latency and failure so loading and error states are real. A mock that
  always resolves in 0 ms with perfect data hides half the UI.

Scaffold the structures these upcoming features will need, without faking the
functionality:

- Authentication — sign in, sign up, logout, session shape
- User profiles
- Dashboard statistics and analytics
- User-specific settings
- Data fetching and mutations
- Roles and permissions, if the flow calls for them

---

## 6. Verification

Nothing is done until all of these pass. Run them yourself; don't report a
result you didn't observe.

```bash
<pm> lint          # zero errors, zero new warnings
<pm> typecheck     # or: tsc --noEmit
<pm> build         # production build must succeed
```

Use whichever package manager the lockfile indicates. If a script doesn't exist,
run the underlying tool directly and mention the gap.

Then, by hand:

- Walk every user flow you touched, end to end.
- Check each layout at mobile, tablet, and desktop widths.
- Trigger the loading, error, and empty states deliberately — don't assume them.
- Tab through the page. If you can't reach or see focus on a control, it's broken.

---

## 7. What to report when you're done

Five sections, in this order, in your final message:

1. **Summary of changes** — what now works that didn't before, in user terms.
2. **Files created or modified** — grouped, with a phrase on each.
3. **Design decisions** — the choices you made under the `frontend-design`
   skill, and the reasoning. Include what you rejected.
4. **Known issues and TODOs** — including anything you stubbed or guessed at.
5. **Recommended next steps** — ordered by what unblocks the most.

Be honest in sections 4 and 5. A clean-looking report that omits a broken flow
costs more than the flow did.

---

## 8. Don't

- Don't build, mock, or call a real backend.
- Don't hardcode data inside components.
- Don't hardcode colors, spacing, or font sizes outside the token system.
- Don't add a dependency you could avoid with twenty lines.
- Don't abstract on the first occurrence. Wait for the second.
- Don't ship a component without its loading, error, and empty states.
- Don't leave `console.log`, commented-out code, or dead exports behind.
- Don't restructure directories, rename conventions, or upgrade major versions
  as a side effect of another task. Propose it separately.
- Don't mark work complete with a failing lint, typecheck, or build.


<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
