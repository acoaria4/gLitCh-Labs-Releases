These files are **not** Cursor project rules. Cursor only auto-loads [`.cursor/rules/`](../rules/).

They are installable **user** rules for `~/.cursor/rules/` (this machine, all projects).

On a new computer:

```bash
./scripts/install-cursor-rules.sh
```

Or copy by hand:

```bash
mkdir -p ~/.cursor/rules
cp .cursor/user-rule-templates/move-to-new-branch.mdc ~/.cursor/rules/
cp .cursor/user-rule-templates/going-for-release.mdc ~/.cursor/rules/
cp .cursor/user-rule-templates/host-caches-no-redownload.mdc ~/.cursor/rules/
cp .cursor/user-rule-templates/root-run-py.mdc ~/.cursor/rules/
```

Then start a **new** Cursor chat (existing sessions may not pick up new `alwaysApply` files).

Do **not** copy into `.cursor/rules/` if you already have the global `~/.cursor/rules` copy — that would apply the rule twice.
