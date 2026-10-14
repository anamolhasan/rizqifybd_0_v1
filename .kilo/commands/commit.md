---
description: Review changes and create a safe Git commit
---

Review the current Git working tree before committing.

1. Run `git status` and inspect the current branch and all relevant diffs.
2. Never include `.env`, credentials, secrets, generated files, or unrelated changes.
3. Identify the files relevant to the current task. Stage only those files; never blindly stage everything.
4. Follow the repository's existing commit message conventions. Use Conventional Commits, such as `fix:`, `feat:`, or `refactor:`.
5. Run appropriate checks when practical.
6. Show a concise summary of the changes and the proposed commit message.
7. Ask for confirmation before creating the commit.
8. After confirmation, create the Git commit.
9. Do not push to the remote repository unless I explicitly request it.

If there are no relevant changes, explain that no commit is needed. Never amend existing commits or force-push unless explicitly requested.