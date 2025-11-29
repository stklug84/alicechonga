// Lysa's Advent Calendar
const CALENDAR_DAYS = 24;
const calendar = document.getElementById('calendar');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalActions = document.getElementById('modal-actions');
const modalClose = document.getElementById('modal-close');

// --- ⚙️ SETTINGS ---

// Set this to TRUE to test the calendar as if it were December 15th
// Set this to FALSE for the real calendar (locks everything until Dec 1st)
const TEST_MODE = true;

// --- DATE LOGIC ---
let now = new Date(); // Get user's actual time

if (TEST_MODE) {
    // Fake the date to December 15th so you can see days 1-15 open
    now = new Date('2025-12-15T10:00:00');
    console.log("⚠️ TEST MODE ACTIVE: Simulating date as " + now);
}

const currentMonth = now.getMonth(); // 0-11 (11 is December)
const currentDay = now.getDate();    // 1-31

console.log("Current Date used for locking:", now);

// Utility: Pad numbers (1 -> 01)
const pad = n => String(n).padStart(2,'0');

// Load days metadata
let daysData = {};
fetch('data/days.json')
    .then(r => r.json())
    .then(d => { daysData = d || {}; buildCalendar(); })
    .catch(err => { console.warn('Error loading days.json', err); buildCalendar(); });

function buildCalendar(){
    calendar.innerHTML = ''; // Clear existing if any

    for(let i=1;i<=CALENDAR_DAYS;i++){
        const dayNum = pad(i);
        const dayEl = document.createElement('button');
        dayEl.className = 'day';
        dayEl.setAttribute('data-day', dayNum);
        dayEl.setAttribute('aria-label', 'Day ' + dayNum);
        dayEl.innerHTML = `<span class="num">${i}</span>`;

        // Check if previously opened
        const isOpened = localStorage.getItem('lisa-day-' + dayNum) === '1';

        // --- LOCKING LOGIC ---
        let isLocked = false;

        // 1. If it is NOT December yet (and not a future year), lock everything
        if (now.getFullYear() === 2025 && currentMonth < 11) {
            isLocked = true;
        }
        // 2. If it IS December, lock days in the future
        else if (currentMonth === 11) {
            if (i > currentDay) {
                isLocked = true;
            }
        }

        // Apply Lock or Click Events
        if(isLocked){
            dayEl.classList.add('locked');
            dayEl.setAttribute('title', `Available on December ${i}`);
            // We do NOT add the click listener, so it's unclickable
        } else {
            if(isOpened) dayEl.classList.add('opened');
            dayEl.addEventListener('click', onDayClick);
        }

        // Add Badge (Optional: Only show badge if unlocked? I'll leave it visible for anticipation)
        if(daysData[dayNum] && daysData[dayNum].badge){
            const b = document.createElement('span');
            b.className='badge';
            b.textContent = daysData[dayNum].badge;
            dayEl.appendChild(b);
        }

        calendar.appendChild(dayEl);
    }

    // Start Snow
    createSnowfall(40);
}

function onDayClick(e){
    const day = e.currentTarget.getAttribute('data-day');
    openDay(day);
}

// Helper: Convert standard Drive link to "Direct View" link
function getDirectDriveLink(url) {
    if (!url) return url;
    // Regex to find the File ID in a standard Drive URL
    const match = url.match(/\/d\/(.+?)\//);
    if (match && match[1]) {
        // Return the "Export/View" format which bypasses the Drive UI
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
    return url;
}

function openDay(day){
    const meta = daysData[day] || {};

    // Mark as opened logic...
    localStorage.setItem('lisa-day-' + day, '1');
    const btn = document.querySelector(`.day[data-day="${day}"]`);
    if(btn) btn.classList.add('opened');

    // Populate Modal
    modal.setAttribute('aria-hidden','false');
    modalTitle.textContent = meta.title || ('Day ' + day);
    modalBody.innerHTML = '';
    modalActions.innerHTML = '';

    // 1. Text Message
    if(meta.text){
        const p = document.createElement('p');
        p.textContent = meta.text;
        p.style.fontSize = "1.1rem";
        p.style.lineHeight = "1.5";
        modalBody.appendChild(p);
    }

    // 2. Google Drive "Direct" Experience
    if(meta.link){
        const isDrive = meta.link.includes('drive.google.com');
        const linkBtn = document.createElement('a');

        // Optimize the URL if it is Google Drive
        if(isDrive) {
            linkBtn.href = getDirectDriveLink(meta.link);
        } else {
            linkBtn.href = meta.link;
        }

        linkBtn.target = '_blank';
        linkBtn.rel = 'noopener';

        if(isDrive) {
            linkBtn.className = 'drive-button';
            // Use a visual style that implies "Media" rather than "Link"
            linkBtn.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #4285F4, #34A853, #FBBC05, #EA4335);
                    padding: 2px;
                    border-radius: 8px;
                    display: inline-block;
                    margin-top: 15px;
                    transition: transform 0.2s;
                ">
                    <div style="
                        background: #0b1220;
                        color: #fff;
                        padding: 12px 24px;
                        border-radius: 6px;
                        font-weight: bold;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    ">
                        <span>🎁</span>
                        <span>View Your Gift</span>
                    </div>
                </div>`;

            // Hover effect via JS since inline styles are tricky
            linkBtn.onmouseover = () => linkBtn.querySelector('div').style.transform = "scale(1.02)";
            linkBtn.onmouseout = () => linkBtn.querySelector('div').style.transform = "scale(1)";

        } else {
            // Standard Link Styling
            linkBtn.textContent = meta.linkText || 'Open Link';
            linkBtn.style.display='inline-block';
            linkBtn.style.marginTop='15px';
            linkBtn.style.color='#ffd54f';
            linkBtn.style.fontWeight='bold';
            linkBtn.style.fontSize='1.1rem';
        }
        modalActions.appendChild(linkBtn);

        if(isDrive){
            const hint = document.createElement('p');
            // Explain that it opens in full screen
            hint.textContent = "(Opens media in new tab)";
            hint.style.fontSize = "0.8rem";
            hint.style.color = "#aaa";
            hint.style.marginTop = "6px";
            modalActions.appendChild(hint);
        }
    }
}

// Close Modal Logic
modalClose.addEventListener('click', ()=> { modal.setAttribute('aria-hidden','true'); });
modal.addEventListener('click', (ev) => {
    if(ev.target === modal) modal.setAttribute('aria-hidden','true');
});

// Continuous Snowfall
function createSnowfall(n){
    // Remove existing snow to prevent duplicates if function runs twice
    const existing = document.querySelectorAll('.snowflake');
    existing.forEach(e => e.remove());

    for(let i=0;i<n;i++){
        const f = document.createElement('div');
        f.className='snowflake';
        const size = 5 + Math.random() * 8;
        f.style.width = size + 'px';
        f.style.height = size + 'px';
        f.style.left = Math.random() * 100 + 'vw';
        f.style.animationDuration = (5 + Math.random() * 10) + 's';
        f.style.animationDelay = (Math.random() * 5) + 's'; // Stagger start times
        f.style.opacity = 0.3 + Math.random() * 0.7;
        document.body.appendChild(f);
    }
}
