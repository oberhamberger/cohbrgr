# TODO

## Cloud Build Deployment (move from Cloud Console to repo)

Currently deployment is configured manually in Google Cloud Console. Moving to a `cloudbuild.yaml` in the repo would make it version-controlled, reviewable, and reproducible.

### Plan

1. **Export existing Cloud Build triggers** from Cloud Console to understand current setup
2. **Create `cloudbuild.yaml`** at repo root with steps:
    - Install pnpm and dependencies
    - Build all packages and apps
    - Run lint and tests
    - Build Docker images for shell, content, and api
    - Push images to Artifact Registry
    - Deploy each service to Cloud Run
3. **Configure Cloud Build trigger** to run on push to `main`
4. **Add deploy notification** — Cloud Build can notify on completion, enabling production e2e:
    - Option A: Add a final Cloud Build step that runs `test:e2e:prod`
    - Option B: Use Cloud Build Pub/Sub notifications to trigger a separate e2e run
5. **Remove manual Cloud Console configuration** once `cloudbuild.yaml` is verified

### Production E2E After Deploy

Once deployment is in `cloudbuild.yaml`, add a post-deploy step:

```yaml
- name: 'node:24'
  entrypoint: 'bash'
  args:
      - '-c'
      - 'npm i -g pnpm && pnpm install && pnpm exec playwright install --with-deps chromium && pnpm run test:e2e:prod'
```

## Performance

- ~~Evaluate streaming SSR~~ → Won't do: streaming sends incomplete HTML with placeholders, defeating the purpose of SSR
