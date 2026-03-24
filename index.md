---
# index.md
layout: default
---

<div class="hero">
  <h1>Global HR for a Changing World</h1>
  <p>Workforces are evolving. Borders are blurring. I help organizations build
  inclusive, ethical, and future-ready HR systems — across cultures and
  continents.</p>
  <div class="hero-buttons">
    <a href="/contact/" class="btn btn-primary">Let's Work Together</a>
    <a href="/speaking/" class="btn btn-secondary">Book Alice to Speak</a>
  </div>
</div>

<div class="home-content">
  <h2>Building Bridges for a Global Workforce</h2>
  <p>
    International HR isn't just about solving problems. It's about building
  bridges between people and opportunity, between compliance and compassion,
  between today's systems and tomorrow's potential. My approach is people-first
  and globally grounded, designed to elevate human potential, drive compliance,
  and support inclusive development.
  </p>
</div>

{% if site.posts.size > 0 %}
<div class="latest-posts">
  <h2>Latest from the Blog</h2>
  <div class="post-cards">
    {% for post in site.posts limit:3 %}
    <div class="post-card">
      <p class="post-meta">{{ post.date | date: "%B %-d, %Y" }}</p>
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt | strip_html | truncate: 120 }}</p>
      <a href="{{ post.url | relative_url }}" class="read-more">Read more &rarr;</a>
    </div>
    {% endfor %}
  </div>
</div>
{% endif %}
