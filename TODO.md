# TODO

## Cloud Build Deployment (move from Cloud Console to repo)

Currently deployment is configured manually in Google Cloud Console (3 separate Cloud Build triggers, one per app). Moving to a single `cloudbuild.yaml` in the repo would make it version-controlled, reviewable, and reproducible.

### Current State

- **Region**: europe-west6 (Zurich)
- **Services**: `cohbrgr` (shell), `cohbrgr-content`, `cohbrgr-api`
- **Registry**: Artifact Registry (assumed, needs confirmation from Console)
- **Trigger**: push to `main` → Cloud Build → Docker build → Cloud Run deploy
- **Build args**: `PROJECT_ID` passed to Dockerfiles, sets `GCLOUD_RUN` env var
- **Runtime env**: `CLOUD_RUN=true`, `NODE_ENV=production`, Cloud Run injects `PORT`
- **Dependencies**: shell fetches content's `remoteEntry.js` at runtime via `cloudRunOrigins`; shell calls api via `cloudRunOrigins.api` — no deploy-order constraint since origins are hardcoded at build time

### Plan

#### Phase 1: Create `cloudbuild.yaml`

Create a single `cloudbuild.yaml` at repo root that replaces all 3 manual triggers.

**Substitution variables** (set on the Cloud Build trigger):

| Variable   | Value          | Purpose                           |
| ---------- | -------------- | --------------------------------- |
| `$_REGION` | `europe-west6` | Cloud Run & Artifact Registry     |
| `$_REPO`   | `cohbrgr`      | Artifact Registry repository name |

**Steps:**

```yaml
steps:
    # 1. Build all three Docker images in parallel
    #    Each Dockerfile does: pnpm install → build app → pnpm deploy --prod
    #    Cloud Build runs these concurrently via waitFor: ['-']
    - id: build-api
      name: gcr.io/cloud-builders/docker
      args:
          - build
          - --tag=$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/api:$SHORT_SHA
          - --tag=$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/api:latest
          - --file=apps/api/Dockerfile
          - --build-arg=PROJECT_ID=$PROJECT_ID
          - .
      waitFor: ['-']

    - id: build-content
      name: gcr.io/cloud-builders/docker
      args:
          - build
          - --tag=$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/content:$SHORT_SHA
          - --tag=$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/content:latest
          - --file=apps/content/Dockerfile
          - --build-arg=PROJECT_ID=$PROJECT_ID
          - .
      waitFor: ['-']

    - id: build-shell
      name: gcr.io/cloud-builders/docker
      args:
          - build
          - --tag=$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/shell:$SHORT_SHA
          - --tag=$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/shell:latest
          - --file=apps/shell/Dockerfile
          - --build-arg=PROJECT_ID=$PROJECT_ID
          - .
      waitFor: ['-']

    # 2. Push images (each waits for its own build)
    - id: push-api
      name: gcr.io/cloud-builders/docker
      args: [push, --all-tags, '$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/api']
      waitFor: [build-api]

    - id: push-content
      name: gcr.io/cloud-builders/docker
      args:
          [
              push,
              --all-tags,
              '$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/content',
          ]
      waitFor: [build-content]

    - id: push-shell
      name: gcr.io/cloud-builders/docker
      args:
          [push, --all-tags, '$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/shell']
      waitFor: [build-shell]

    # 3. Deploy to Cloud Run (each waits for its own push)
    - id: deploy-api
      name: gcr.io/cloud-builders/gcloud
      args:
          - run
          - deploy
          - cohbrgr-api
          - --image=$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/api:$SHORT_SHA
          - --region=$_REGION
          - --platform=managed
          - --allow-unauthenticated
      waitFor: [push-api]

    - id: deploy-content
      name: gcr.io/cloud-builders/gcloud
      args:
          - run
          - deploy
          - cohbrgr-content
          - --image=$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/content:$SHORT_SHA
          - --region=$_REGION
          - --platform=managed
          - --allow-unauthenticated
      waitFor: [push-content]

    - id: deploy-shell
      name: gcr.io/cloud-builders/gcloud
      args:
          - run
          - deploy
          - cohbrgr
          - --image=$_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/shell:$SHORT_SHA
          - --region=$_REGION
          - --platform=managed
          - --allow-unauthenticated
      waitFor: [push-shell]

    # 4. Post-deploy e2e smoke test
    - id: e2e
      name: node:24
      entrypoint: bash
      args:
          - -c
          - |
              corepack enable
              pnpm install --frozen-lockfile
              pnpm exec playwright install --with-deps chromium
              E2E_BASE_URL=https://cohbrgr.com pnpm run test:e2e
      waitFor: [deploy-api, deploy-content, deploy-shell]

images:
    - $_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/api:$SHORT_SHA
    - $_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/content:$SHORT_SHA
    - $_REGION-docker.pkg.dev/$PROJECT_ID/$_REPO/shell:$SHORT_SHA

options:
    logging: CLOUD_LOGGING_ONLY
    machineType: E2_HIGHCPU_8
```

**Why no lint/test step in Cloud Build**: CI (lint, test, integration, e2e) already runs in GitHub Actions on every push. Cloud Build only triggers on `main` after CI has passed. Duplicating checks would add ~5 minutes to every deploy for no benefit.

**Why parallel builds**: The three Dockerfiles each run `pnpm install` independently (full monorepo context). Building in parallel (`waitFor: ['-']`) cuts total build time from ~15 min to ~5 min. The `E2_HIGHCPU_8` machine type handles the concurrent builds.

#### Phase 2: GCP Prerequisites

Before the `cloudbuild.yaml` works, ensure these are in place:

1. **Artifact Registry repository**

    ```bash
    gcloud artifacts repositories create cohbrgr \
        --repository-format=docker \
        --location=europe-west6 \
        --description="cohbrgr container images"
    ```

2. **Cloud Build service account permissions** — the default Cloud Build SA (`PROJECT_NUMBER@cloudbuild.gserviceaccount.com`) needs:
    - `roles/run.admin` — deploy to Cloud Run
    - `roles/iam.serviceAccountUser` — act as Cloud Run runtime SA
    - `roles/artifactregistry.writer` — push images

3. **Cloud Build trigger**

    ```bash
    gcloud builds triggers create github \
        --repo-name=cohbrgr \
        --repo-owner=oberhamberger \
        --branch-pattern='^main$' \
        --build-config=cloudbuild.yaml \
        --substitutions=_REGION=europe-west6,_REPO=cohbrgr
    ```

4. **Verify Cloud Run service names** match what's in the yaml:
    ```bash
    gcloud run services list --region=europe-west6
    ```

#### Phase 3: Migration

1. Create the `cloudbuild.yaml` and push to a feature branch
2. Manually run the Cloud Build trigger against the feature branch to validate
    ```bash
    gcloud builds submit --config=cloudbuild.yaml \
        --substitutions=_REGION=europe-west6,_REPO=cohbrgr
    ```
3. Verify all three services deploy and pass e2e
4. Merge to `main` — the new trigger fires automatically
5. Delete the 3 old manual Cloud Build triggers from Console
6. Document the substitution variables in CLAUDE.md

#### Phase 4: Future Improvements

- **Build cache**: Use Kaniko (`gcr.io/kaniko-project/executor`) instead of `gcr.io/cloud-builders/docker` for layer caching across builds — could cut build time by 50%+
- **Selective deploys**: Only rebuild/deploy apps whose source changed (check `git diff` against `apps/*/` and `packages/*/`)
- **Rollback script**: `scripts/rollback.sh` that reverts a Cloud Run service to its previous revision
- **Deploy notifications**: Cloud Build → Pub/Sub → webhook to post deploy status

## Performance

- ~~Evaluate streaming SSR~~ → Won't do: streaming sends incomplete HTML with placeholders, defeating the purpose of SSR
