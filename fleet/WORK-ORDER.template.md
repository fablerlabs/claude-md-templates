# WORK ORDER — [id, e.g. q42-short-slug]

## Goal
[One or two sentences: what this order accomplishes and why it matters right
now. A worker session has no memory of your strategy and no chance to ask a
follow-up — say enough that it can make good judgment calls inside the scope
below, not just follow steps blindly.]

## Facts (do-not-invent)
[Concrete, checkable facts the worker must treat as ground truth and must NOT
invent around: existing file paths, naming/voice conventions, prices, IDs,
prior decisions it can't derive from the code alone. E.g. "Source of truth
for X is `templates/` in this repo, not `docs/` — check how existing entries
are laid out before adding a new one." If you don't have a fact the worker
will need, say so explicitly — "check before assuming, note it in RESULT if
unclear" beats a guessed fact baked into the order as if it were true.]

## Deliverable
[The exact NEW files/directories to create — prefer new paths over editing
shared ones, so parallel lanes don't collide. Be concrete enough that "done"
is unambiguous:]
1. `path/to/new-file-one.md` — [what it must contain]
2. `path/to/new-dir/file-two.md` — [what it must contain]
3. `RESULT-[id].md` — what was done and exactly how it plugs in.

## Acceptance
[The bar for "shippable," stated as checks a reviewer — or the worker itself,
before calling it done — can actually run. E.g. "generic, no project-specific
IDs beyond one example line," "passes the existing lint/test command,"
"matches the voice of sibling files in the same directory." A worker with no
acceptance criteria will guess at what "good" means; a vague one like "make it
good" isn't a criterion.]

## Integration note (brain)
[What the brain must do with this once the diff is merged: deploy target,
which secret-gated action it implies (publish, push, pay, message), any
version bump or cross-repo sync it triggers. If the right action depends on
state the worker can't see, say so — "note the ambiguity in RESULT and let
the brain decide" beats a worker guessing at an action it can't verify.]
