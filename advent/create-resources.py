import os, json
from pathlib import Path

# --- Configuration ---
# Set the base directory to the current working directory for GitHub Pages deployment
# This assumes you will run the script from the root of your project
BASE_DIR = Path(".")

# Define the relative paths for the necessary directories
DATA_DIR = BASE_DIR / "data"
DAYS_DIR = BASE_DIR / "days"

# Ensure directories exist
DATA_DIR.mkdir(exist_ok=True)
DAYS_DIR.mkdir(exist_ok=True)

# --- Generate data/days.json ---
days_json = {}
for i in range(1, 25):
    day = f"{i:02d}"
    days_json[day] = {
        "title": f"Day {day}",
        "text": "",
        "file": "",
        "link": "",
        "badge": "",
        "password": ""
    }

# Write days.json
with open(DATA_DIR / "days.json", "w") as f:
    f.write(json.dumps(days_json, indent=2))
print(f"Created {DATA_DIR / 'days.json'}")

# --- Day Page Template ---
# day page template with distinct placeholders __DAY__
day_page_template = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Lysa's Advent - Day __DAY__</title>
<link rel="stylesheet" href="../style.css">
</head>
<body>
  <main class="wrap">
    <header>
      <h1>🎁 Day __DAY__ — __TITLE__</h1>
      <p class="subtitle">Your gift is waiting — add it in data/days.json or assets/</p>
    </header>

    <article id="content">
      <p id="text"></p>
      <div id="file-preview"></div>
      <p><a id="back" href="../index.html">← Back to calendar</a></p>
    </article>
  </main>

<script>
const day = "__DAY__";
fetch('../data/days.json')
  .then(r=>r.json())
  .then(d=>{
    const entry = d[day] || {};
    document.getElementById('text').textContent = entry.text || '';
    const fp = document.getElementById('file-preview');
    if(entry.file){
      const ext = entry.file.split('.').pop().toLowerCase();
      if(['png','jpg','jpeg','gif','webp','svg'].includes(ext)){
        const img = document.createElement('img');
        img.src = '../' + entry.file;
        img.alt = entry.title || 'Gift';
        img.style.maxWidth='100%';
        fp.appendChild(img);
      } else if(['mp4','webm','ogg'].includes(ext)){
        const v = document.createElement('video');
        v.src = '../' + entry.file; v.controls = true; v.style.maxWidth='100%';
        fp.appendChild(v);
      } else {
        const a = document.createElement('a');
        a.href = '../' + entry.file; a.textContent='Open/download file'; a.target='_blank'; a.rel='noopener';
        fp.appendChild(a);
      }
    }
    if(entry.link){
      const la = document.createElement('p');
      la.innerHTML = '<a href="'+entry.link+'" target="_blank" rel="noopener">'+(entry.linkText||entry.link)+'</a>';
      fp.appendChild(la);
    }
  });
</script>

</body>
</html>
"""

# --- Generate Day HTML Files ---
for i in range(1, 25):
    day = f"{i:02d}"
    title = f"Day {day}"
    content = day_page_template.replace("__DAY__", day).replace("__TITLE__", title)

    file_path = DAYS_DIR / f"{day}.html"
    with open(file_path, "w") as f:
        f.write(content)
    print(f"Created {file_path}")

print("\nAll resource files generated successfully.")
