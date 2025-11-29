import json
from pathlib import Path

# --- Configuration ---
DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)
JSON_FILE_PATH = DATA_DIR / "days.json"
CALENDAR_DAYS = 24

# --- Helper function for Drive Links ---
# You will replace these placeholders with your REAL Drive links manually later
def get_drive_placeholder(day_num):
    return f"https://drive.google.com/file/d/PLACEHOLDER_FOR_DAY_{day_num}/view?usp=sharing"

# --- Content Data ---
TITLES = [
    "December Begins!", "A Special Memory", "Music for You", "Secret Recipe",
    "Winter Vibes", "A Tiny Puzzle", "Just for Laughs", "Look Back",
    "Cozy Moment", "Something Sweet", "Digital Hug", "Halfway There!",
    "Weekend Read", "Video Message", "Desktop Wallpaper", "Funny Clip",
    "Favorite Photo", "A Challenge", "Relaxing Sound", "Poem for You",
    "Countdown...", "Almost Time", "Christmas Eve Eve", "The Grand Finale"
]

TEXTS = [
    "Welcome to your personal Advent Calendar! Click the button below to see your first surprise.",
    "I found this and thought of you.",
    "Listen to this while you drink your coffee.",
    "You have to try making this!",
    "Sending you some winter warmth.",
    "Can you figure this out?",
    "Hope this makes you smile.",
    "Remember when we did this?",
    "Take a moment to relax today.",
    "Wishing you sweetness today.",
    "Sending love from afar.",
    "12 days down, 12 to go!",
    "Something interesting to read.",
    "I recorded a little message for you.",
    "New background for your screen.",
    "This made me laugh so hard.",
    "One of my favorite pictures.",
    "Bet you can't do this!",
    "Close your eyes and listen.",
    "A few rhymes for the season.",
    "The big day is getting close.",
    "Get your stockings ready.",
    "One more sleep (after this one)!",
    "Merry Christmas! Open your final gift."
]

days_data = {}

for i in range(1, CALENDAR_DAYS + 1):
    day = f"{i:02d}"

    # Cycle through titles/texts
    t_idx = (i - 1) % len(TITLES)
    txt_idx = (i - 1) % len(TEXTS)

    days_data[day] = {
        "title": TITLES[t_idx],
        "text": TEXTS[txt_idx],
        # The 'file' field is removed/empty because we use Drive links now
        "file": "",
        # This is where your Google Drive link goes
        "link": get_drive_placeholder(day),
        "linkText": "Open Gift on Drive",
        "badge": "Gift" if i % 5 == 0 else "",
        # Optional: Keep password if you want the extra "game" element
        "password": ""
    }

# --- Write File ---
try:
    with open(JSON_FILE_PATH, "w") as f:
        json.dump(days_data, f, indent=2)
    print(f"Updated {JSON_FILE_PATH} for Google Drive integration.")
    print("Next step: Manually edit 'data/days.json' and paste your real Google Drive links.")
except Exception as e:
    print(f"Error: {e}")
