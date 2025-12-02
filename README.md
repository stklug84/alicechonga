# Alice Chonga - International HR Strategist

> **"Global HR for a Changing World."**

This repository contains the source code for **alicechonga.com**, the
professional portfolio of Alice Chonga. The site highlights her expertise as an
International HR Leader, Workplace Strategist, and Global Mobility Expert,
helping organizations build ethical and future-ready HR systems across borders.

## 📂 Project Overview

The website is a static site built with **Jekyll** and hosted on **GitHub
Pages**. It serves as a hub for professional services, speaking engagements, and
HR resources.

### Key Sections

* **About**: Professional background in labour migration, people strategy, and
  organizational culture.
* **Services**: Details on Global Talent Mobility, Startup HR Systems,
  Cross-Border Policy, and DEI initiatives.
* **Speaking**: Information on workshops and panels regarding Global Workforce
  Trends and Ethical Mobility.
* **Resources**: Free downloads and tools for startups and NGOs.
* **Contact**: Connection details and inquiry forms.

### 🎄 Special Feature: Lysa's Advent Calendar

The project includes a custom-built interactive Advent Calendar located in the
`/advent` directory.

* **Features**: Daily unlocks, modal popups for gifts (video/images/links), and
  a continuous snowfall effect.
* **Data Source**: Content for each day is managed via a JSON file (`advent/data/days.json`).

## 🛠 Tech Stack & Deployment

* **Framework**: Jekyll (Ruby)
* **Styling**: Custom CSS with responsive design.
* **Hosting**: GitHub Pages via CNAME `alicechonga.com`.

### CI/CD Pipeline

This repository uses a custom GitHub Actions workflow, **Smart Canary Deploy**,
to manage deployments.

* **Production**: Deploys the `main` branch to the live site.
* **Canary Builds**: Pushes to the `canary` branch are built to a subdirectory
  (`/canary`) for testing.
* **Optimization**: Includes caching and "Fast Update" logic to update JSON data
  without rebuilding the entire site when possible.

## 🚀 Local Development

To run this site locally:

1. **Prerequisites**: Ensure you have Ruby and Bundler installed.
1. **Install Dependencies**:

   ```bash
     bundle install
   ```

1. **Run the Server**:

   ```bash
     bundle exec jekyll serve
   ```

1. **View the Site**: Open `http://localhost:4000` in your browser.
