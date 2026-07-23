# Proposals

This directory contains proposals for work that has been thought through but not yet started or finished. Unlike [ADRs](../adr/README.md) (which document decisions that have been made), proposals describe ideas, plans, and pending initiatives.

A proposal becomes obsolete in one of three ways:

- **Shipped**: the work is done and the proposal is deleted (the code is the source of truth)
- **Promoted to ADR**: the proposal made a significant architectural decision and is rewritten as an ADR
- **Rejected**: the proposal is no longer worth pursuing and is deleted (use git history to recover if needed)

## Proposal Index

| Proposal                                    | Title                        |
| ------------------------------------------- | ---------------------------- |
| [cli-package](./cli-package.md)             | Publish `cohbrgr` CLI to npm |
| [mobile-native-app](./mobile-native-app.md) | Native Mobile App with Expo  |

## Creating a New Proposal

1. Create `docs/proposals/short-description.md`
2. Cover: motivation, scope, plan, open questions
3. Update this README's index
4. Keep it short. Anything long enough to need a table of contents probably belongs in `docs/` proper, not as a proposal.
