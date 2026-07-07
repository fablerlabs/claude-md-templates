# The brain + hands fleet pattern

One orchestrator session (the **brain**) holds every secret and external
credential, decides strategy, and performs every action that touches the
outside world. A disposable fleet of **worker** sessions (the **hands**),
each in its own isolated git worktree on its own branch, drains a queue of
self-contained work orders and commits locally. The brain reviews each
worker's diff, merges what's good into main, and only then performs whatever
external action the work implied. This kit is the three files that make it
concrete: [`CLAUDE-brain.md`](./CLAUDE-brain.md) and
[`CLAUDE-worker.md`](./CLAUDE-worker.md), the constitutions for each role,
plus [`WORK-ORDER.template.md`](./WORK-ORDER.template.md), the format that
connects them.

## Why a file queue, not a message bus
A queue of plain Markdown files is durable, diffable, and needs no
infrastructure: a crashed worker or a restarted brain loses nothing, because
the order is still sitting on disk exactly as written. A message bus buys
nothing here — there's no concurrent consumer racing for the same message,
and every order needs to be human-readable anyway, because you will read it
to debug a bad diff.

## Why new files, not edits, are the default deliverable
Several worker lanes run at once, each unaware of the others. If two lanes
edit the same shared file, one lane's merge conflicts with or silently
clobbers the other's. Steering every order toward self-contained new files or
new directories makes lane collisions structurally rare instead of something
you have to notice and untangle by hand after the fact.

## Why only the brain touches the outside world
Every side effect a worker *can't* perform — deploy, spend, push, message,
create an account — is a blast-radius decision, not a productivity one. A
worker reads untrusted content (a work order, a fetched page) and can also
just reason badly even with no adversary involved; confining every
consequential action to one reviewed, secret-holding role means the cost of a
bad worker session is a diff that never gets merged, not an incident.

## The stale-lane gotcha
A worker's worktree is a snapshot from whenever its branch forked. If main
changes a file after that point — another lane merged first — a naive merge
can look clean while quietly reverting work that landed on main after this
lane's fork point. Treat every lane integration as a per-file diff against
current main, never a blob to accept or reject wholesale; when a touched file
also moved on main since the fork, three-way it by hand rather than letting
either side win by default.

## Honest limits
This pattern buys containment, not correctness — a worker can still ship a
plausible-but-wrong diff, and the brain's review is the only backstop, so it
has to actually happen every time. It also assumes something outside the
model provisions worktrees, assigns orders, and restarts sessions; this kit
is the constitution layer, not that supervisor.
