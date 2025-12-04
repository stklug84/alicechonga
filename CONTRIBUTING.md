# Contributing to Alice Chonga's Portfolio

Welcome to the development guide for **alicechonga.com**. This project uses a
**Simplified Gitflow** strategy to ensure that new features are rigorously
tested in a "Canary" environment before going live.

## 🌿 Branching Strategy

We use three types of branches to manage development and deployment:

| Branch | Role | Deployment URL | Description |
| :--- | :--- | :--- | :--- |
| **`main`** | **Production** | `alicechonga.com` | The stable, live code. **Never push directly to main.** We enforce a strictly **linear history** here. |
| **`develop`** | **Canary** | `.../canary` | The integration branch. Code here is automatically deployed to a test sub-site with a "Canary Build" badge. |
| **`feature/*`** | **Development** | Localhost | Temporary branches for new features or fixes. |

---

## 🔄 The Workflow

### 1. Start a New Feature

Always create your feature branch from `develop` to ensure you are working with
the latest code.

```bash
# 1. Update your local develop branch
git checkout develop
git pull origin develop

# 2. Create a new feature branch
git checkout -b feature/my-new-feature
````

### 2\. Develop & Test Locally

Run the Jekyll site locally to verify your changes.

```bash
bundle exec jekyll serve
# Visit http://localhost:4000
```

### 3\. Merge to Canary (`develop`)

When you are ready to test your changes in the cloud, push your branch and open
a Pull Request (PR) to the `develop` branch.

* **Action:** Open PR: `feature/my-new-feature` ➔ `develop`.
* **Automation:** Upon merging, the **Smart Canary Deploy** workflow will
  automatically build your code and deploy it to the `/canary` subdirectory.
* **Verification:** Visit `alicechonga.com/canary` to see your changes live
  (look for the yellow "Canary Build" badge).

---

## 🚀 Releasing to Production (Linear History)

We enforce a **linear history** on `main` (no merge commits). Because `develop`
accumulates many small commits, we must use a specific workflow to release
cleanly.

### Step 1: Squash and Merge

1. Open a Pull Request from `develop` to `main`.
1. Select **Squash and merge** (do not use "Create a merge commit").
   * *This combines all your recent work into a single, clean "Release" commit
     on `main`.*

### Step 2: Sync Develop (Crucial)

Because you squashed the commits, `main` and `develop` have diverged. You must
immediately "fast-forward" `develop` to match the new history on `main` so they
stay in sync.

Run this locally immediately after merging:

```bash
# 1. Update local main
git checkout main
git pull origin main

# 2. Reset develop to match main exactly
git checkout develop
git reset --hard main

# 3. Force push to update the remote develop branch
git push origin develop --force
```

---

## 🚑 Hotfixes (Reverse Syncing)

If a critical bug is fixed directly on `main` (a "hotfix"), `develop` will fall
behind. You must sync `main` back into `develop` to ensure future features
include the fix.

```bash
git checkout develop
git merge main
git push origin develop
```

---

## 🤖 CI/CD Automation Notes

This project uses **GitHub Actions**
(`.github/workflows/smart-canary-deploy.yml`) to handle deployments:

* **Smart JSON Update:** If only data files (e.g., `advent/data/days.json`) are
  changed on the `main` branch, the workflow skips the full build and rapidly
  updates the file in the existing site.
* **Badge Injection:** When building the `develop` branch, the workflow injects
  a visual badge to distinguish the test environment from production.
