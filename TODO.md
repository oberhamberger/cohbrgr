# TODO

## Cloud Build Deployment (move from Cloud Console to repo)

Currently deployment is configured manually in Google Cloud Console (3 separate Cloud Build triggers, one per app). Moving to a single `cloudbuild.yaml` in the repo would make it version-controlled, reviewable, and reproducible.

### Current State

- **Project**: `cohb-9fa5f` (number `944962437395`)
- **Registry**: `cloud-run-source-deploy` (default Artifact Registry repo, region-specific)
- **3 separate Cloud Build triggers** (all global region), one per app:
    - Shell: `233d4973` · Content: `72f3cb79` · API: `b0a3e918`
- **Build args**: `PROJECT_ID` passed to Dockerfiles, sets `GCLOUD_RUN` env var
- **Runtime env**: `CLOUD_RUN=true` and `NODE_ENV=production` baked into Docker images; Cloud Run injects `PORT`
- **Dependencies**: shell fetches content's `remoteEntry.js` at runtime via `cloudRunOrigins`; shell calls api via `cloudRunOrigins.api` — no deploy-order constraint since origins are hardcoded at build time

#### Service Configuration

| Property            | Shell (`cohbrgr`)                                                   | Content (`cohbrgr-content`)     | API (`cohbrgr-api`)             |
| ------------------- | ------------------------------------------------------------------- | ------------------------------- | ------------------------------- |
| **Region**          | europe-north1                                                       | europe-west6                    | europe-west6                    |
| **Image registry**  | `europe-north1-docker.pkg.dev/cohb-9fa5f/cloud-run-source-deploy/…` | `europe-west6-docker.pkg.dev/…` | `europe-west6-docker.pkg.dev/…` |
| **Port**            | 3000                                                                | 3001                            | 3002                            |
| **CPU / Memory**    | 1 vCPU / 256Mi                                                      | 1 vCPU / 512Mi                  | 1 vCPU / 512Mi                  |
| **Max instances**   | 2                                                                   | 2                               | 2                               |
| **Concurrency**     | 80                                                                  | 80                              | 80                              |
| **Service account** | `cohbrgr-service-account@cohb-9fa5f.iam.gserviceaccount.com`        | default compute SA              | default compute SA              |
| **Startup boost**   | yes                                                                 | yes                             | yes                             |
| **Image tag**       | full commit SHA                                                     | full commit SHA                 | full commit SHA                 |

#### Cleanup Opportunities

- **Shell in different region**: shell is europe-north1 while content/api are europe-west6 — adds cross-region latency. Consider consolidating to one region.
- **Content maxScale 100**: template annotation says `maxScale: 100` while metadata says 2. Likely stale — should be 2 like the others.
- **Service accounts**: content/api use the default compute SA (`944962437395-compute@developer.gserviceaccount.com`) instead of the dedicated `cohbrgr-service-account`. Consider using the dedicated SA for all three.
- **Unused `ENV=prod`**: content and api Cloud Run configs set `ENV=prod`, but the apps read `NODE_ENV` (set in Dockerfile). These env vars are unused and can be removed.

### Plan

#### Phase 1: Create `cloudbuild.yaml`

Create a single `cloudbuild.yaml` at repo root that replaces all 3 manual triggers.

Since shell is in europe-north1 and content/api are in europe-west6, the `cloudbuild.yaml` must handle two regions. Image paths match the existing convention: `<region>-docker.pkg.dev/cohb-9fa5f/cloud-run-source-deploy/cohbrgr/<service>:<commit-sha>`.

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
          - --tag=europe-west6-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr-api:$COMMIT_SHA
          - --tag=europe-west6-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr-api:latest
          - --file=apps/api/Dockerfile
          - --build-arg=PROJECT_ID=$PROJECT_ID
          - .
      waitFor: ['-']

    - id: build-content
      name: gcr.io/cloud-builders/docker
      args:
          - build
          - --tag=europe-west6-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr-content:$COMMIT_SHA
          - --tag=europe-west6-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr-content:latest
          - --file=apps/content/Dockerfile
          - --build-arg=PROJECT_ID=$PROJECT_ID
          - .
      waitFor: ['-']

    - id: build-shell
      name: gcr.io/cloud-builders/docker
      args:
          - build
          - --tag=europe-north1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr:$COMMIT_SHA
          - --tag=europe-north1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr:latest
          - --file=apps/shell/Dockerfile
          - --build-arg=PROJECT_ID=$PROJECT_ID
          - .
      waitFor: ['-']

    # 2. Push images (each waits for its own build)
    - id: push-api
      name: gcr.io/cloud-builders/docker
      args:
          [
              push,
              --all-tags,
              'europe-west6-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr-api',
          ]
      waitFor: [build-api]

    - id: push-content
      name: gcr.io/cloud-builders/docker
      args:
          [
              push,
              --all-tags,
              'europe-west6-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr-content',
          ]
      waitFor: [build-content]

    - id: push-shell
      name: gcr.io/cloud-builders/docker
      args:
          [
              push,
              --all-tags,
              'europe-north1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr',
          ]
      waitFor: [build-shell]

    # 3. Deploy to Cloud Run (each waits for its own push)
    - id: deploy-api
      name: gcr.io/cloud-builders/gcloud
      args:
          - run
          - deploy
          - cohbrgr-api
          - --image=europe-west6-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr-api:$COMMIT_SHA
          - --region=europe-west6
          - --platform=managed
          - --allow-unauthenticated
      waitFor: [push-api]

    - id: deploy-content
      name: gcr.io/cloud-builders/gcloud
      args:
          - run
          - deploy
          - cohbrgr-content
          - --image=europe-west6-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr-content:$COMMIT_SHA
          - --region=europe-west6
          - --platform=managed
          - --allow-unauthenticated
      waitFor: [push-content]

    - id: deploy-shell
      name: gcr.io/cloud-builders/gcloud
      args:
          - run
          - deploy
          - cohbrgr
          - --image=europe-north1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr:$COMMIT_SHA
          - --region=europe-north1
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
    - europe-west6-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr-api:$COMMIT_SHA
    - europe-west6-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr-content:$COMMIT_SHA
    - europe-north1-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/cohbrgr/cohbrgr:$COMMIT_SHA

options:
    logging: CLOUD_LOGGING_ONLY
    machineType: E2_HIGHCPU_8
```

**Why `$COMMIT_SHA` not `$SHORT_SHA`**: The existing triggers tag images with full commit SHA. Keeping this convention preserves traceability and matches the `commit-sha` label on the Cloud Run services.

**Why no lint/test step in Cloud Build**: CI (lint, test, integration, e2e) already runs in GitHub Actions on every push. Cloud Build only triggers on `main` after CI has passed. Duplicating checks would add ~5 minutes to every deploy for no benefit.

**Why parallel builds**: The three Dockerfiles each run `pnpm install` independently (full monorepo context). Building in parallel (`waitFor: ['-']`) cuts total build time from ~15 min to ~5 min. The `E2_HIGHCPU_8` machine type handles the concurrent builds.

#### Phase 2: GCP Prerequisites

The existing setup already has most of this in place. Verify before proceeding:

1. **Artifact Registry repos** — the existing `cloud-run-source-deploy` repos already exist in both regions (created automatically by the current triggers). Verify:

    ```bash
    gcloud artifacts repositories list --location=europe-west6
    gcloud artifacts repositories list --location=europe-north1
    ```

2. **Cloud Build service account permissions** — the default compute SA (`944962437395-compute@developer.gserviceaccount.com`) is already used by the existing triggers and has the required roles. Verify it can deploy to both regions:
    - `roles/run.admin` — deploy to Cloud Run
    - `roles/iam.serviceAccountUser` — act as Cloud Run runtime SA
    - `roles/artifactregistry.writer` — push images to both regional repos

3. **Create the new unified Cloud Build trigger**

    ```bash
    gcloud builds triggers create github \
        --repo-name=cohbrgr \
        --repo-owner=oberhamberger \
        --branch-pattern='^main$' \
        --build-config=cloudbuild.yaml
    ```

4. **Verify Cloud Run service names**
    ```bash
    gcloud run services list --region=europe-north1  # cohbrgr
    gcloud run services list --region=europe-west6   # cohbrgr-content, cohbrgr-api
    ```

#### Phase 3: Migration

1. Create `cloudbuild.yaml` and push to a feature branch
2. Manually submit to validate (does NOT deploy — just builds):
    ```bash
    gcloud builds submit --config=cloudbuild.yaml --no-source
    ```
3. Once builds pass, test a full deploy from the branch using Console "Run trigger" with the branch override
4. Verify all three services deploy and pass e2e
5. Merge to `main` — the new trigger fires automatically
6. Delete the 3 old Cloud Build triggers:
    ```bash
    gcloud builds triggers delete 233d4973-143c-4966-af27-caf1d8ef46e3
    gcloud builds triggers delete 72f3cb79-3905-42cc-83b9-cfe3e48518cc
    gcloud builds triggers delete b0a3e918-a282-46ad-81e4-9594c6e9e2c8
    ```
7. Document the deployment setup in CLAUDE.md

#### Phase 4: Future Improvements

- **Build cache**: Use Kaniko (`gcr.io/kaniko-project/executor`) instead of `gcr.io/cloud-builders/docker` for layer caching across builds — could cut build time by 50%+
- **Selective deploys**: Only rebuild/deploy apps whose source changed (check `git diff` against `apps/*/` and `packages/*/`)
- **Rollback script**: `scripts/rollback.sh` that reverts a Cloud Run service to its previous revision
- **Deploy notifications**: Cloud Build → Pub/Sub → webhook to post deploy status

## Performance

- ~~Evaluate streaming SSR~~ → Won't do: streaming sends incomplete HTML with placeholders, defeating the purpose of SSR
