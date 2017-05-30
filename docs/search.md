---
layout: docs
title: Code Search
path: /docs/search
---

# Code Search

To perform a search:

1. Click the Search icon on the left sidebar to open search
2. Type a query (punctuation and symbols are OK)
3. Press Enter

Press the `⋯` icon or continue reading for more search options.

## Regular expression search

The `.*` icon in the query field toggles regular expressions. See [regexp syntax documentation](https://sourcegraph.com/github.com/golang/go/src/regexp/syntax/doc.go?go1.8).

## Select multiple repositories to search

The current repository is always searched. To include results from other repositories, type them into the `other repositories to include` field, separated by commas.

> Example: <code>github.com/facebook/react,&#8203;github.com/antirez/redis,&#8203;github.com/sqs/spans</code>

Free users of Sourcegraph.com can search up to 25 repositories at once. There is no limit for paid and Enterprise users.

## Specify which Git revision to search

Click on the <span class="octicon octicon-git-branch"></span> Git revision in the status bar to switch revisions. Results from other repositories are currently drawn from their default branches only.

> All Git revisions are always searchable. No need to wait for indexing!

## Include/exclude paths

The `files to include` and `files to exclude` fields accept a comma-separated list of paths (or globs, if enabled). These paths apply to all repositories in a multi-repository search.

> Common vendor directories are excluded by default. You can change this in the `search.exclude` user setting.

## Show code authors and commit information from `git blame`

If you're logged in, you can see inline authorship and commit information in the results. To enable blame, press the eye icon in the status bar when viewing a result file.