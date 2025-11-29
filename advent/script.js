// Lysa's Advent Calendar
const CALENDAR_DAYS = 24;
const calendar = document.getElementById('calendar');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalActions = document.getElementById('modal-actions');
const modalClose = document.getElementById('modal-close');

// --- DATE CHECKING CONFIGURATION ---

// 1. Real Date
const now = new Date();

// 2. TEST DATE (Uncomment the line below to test "as if" it were Dec 5th)
const now = new Date('2025-12-05T10:00:00');

const currentMonth = now.getMonth(); // 0-11 (11 is December)
const currentDay = now.getDate();    // 1-31

// Load days metadata
let daysData = {};
fetch('data/days.json')
    .then(r => r.json())
    .then(d => { daysData = d || {}; buildCalendar(); })
    .catch(err => { console.warn('Error loading days.json', err); buildCalendar(); });

function buildCalendar(){
    for(let i=1;i<=CALENDAR_DAYS;i++){
        const dayNum = pad(i);
        const dayEl = document.createElement('button');
        dayEl.className = 'day';
        dayEl.setAttribute('data-day', dayNum);
        dayEl.setAttribute('aria-label', 'Day ' + dayNum);
        dayEl.innerHTML = `<span class="num">${i}</span>`;

        // Mark opened if stored in browser (unless it's locked now)
        const isOpened = localStorage.getItem('lisa-day-' + dayNum) === '1';

        // --- STRICT LOCKING LOGIC ---
        let isLocked = false;

        if (currentMonth < 11) {
            // It is BEFORE December (e.g., November). Lock Everything.
            isLocked = true;
        } else if (currentMonth === 11) {
            // It is December. Lock days in the future.
            if (i > currentDay) {
                isLocked = true;
            }
        }
        // If currentMonth > 11 (January next year), everything remains unlocked.

        if(isLocked){
            dayEl.classList.add('locked');
            dayEl.setAttribute('title', 'Available on December ' + i);
            dayEl.disabled = true;
        } else {
            // Only add click listener and open styles if NOT locked
            if(isOpened) dayEl.classList.add('opened');
            dayEl.addEventListener('click', onDayClick);
        }

        // Add badge if exists (and maybe hide it if locked? Up to you. Currently shows always.)
        if(daysData[dayNum] && daysData[dayNum].badge){
            const b = document.createElement('span');
            b.className='badge';
            b.textContent = daysData[dayNum].badge;
            dayEl.appendChild(b);
        }

        calendar.appendChild(dayEl);
    }

    // Start continuous snowfall
    createSnowfall(30);
}

// Utility
const pad = n => String(n).padStart(2,'0');

function onDayClick(e){
    const day = e.currentTarget.getAttribute('data-day');
    openDay(day);
}

function openDay(day){
    const meta = daysData[day] || {};

    // Mark as opened
    localStorage.setItem('lisa-day-' + day, '1');
    const btn = document.querySelector('.day[data-day=\"'+day+'\"]');
    if(btn) btn.classList.add('opened');

    // Populate Modal
    modal.setAttribute('aria-hidden','false');
    modalTitle.textContent = meta.title || ('Day ' + day);
    modalBody.innerHTML = '';
    modalActions.innerHTML = '';

    // 1. Text
    if(meta.text){
        const p = document.createElement('p');
        p.textContent = meta.text;
        p.style.fontSize = "1.1rem";
        p.style.lineHeight = "1.5";
        modalBody.appendChild(p);
    }

    // 2. Google Drive / External Link
    if(meta.link){
        const isDrive = meta.link.includes('drive.google.com');
        const linkBtn = document.createElement('a');
        linkBtn.href = meta.link;
        linkBtn.target = '_blank';
        linkBtn.rel = 'noopener';

        if(isDrive) {
            linkBtn.className = 'drive-button';
            linkBtn.innerHTML = `
                <div style="background:#fff; color:#222; padding:12px 20px; border-radius:8px; font-weight:bold; margin-top:15px; text-decoration:none; display:inline-block;">
                    🎁 Unwrap on Google Drive
                </div>`;
        } else {
            linkBtn.textContent = meta.linkText || 'Open Link';
            linkBtn.style.display='inline-block';
            linkBtn.style.marginTop='15px';
            linkBtn.style.color='#ffd54f';
            linkBtn.style.fontWeight='bold';
        }
        modalActions.appendChild(linkBtn);

        if(isDrive){
            const hint = document.createElement('p');
            hint.textContent = "(Sign in to Google to view)";
            hint.style.fontSize = "0.8rem";
            hint.style.color = "#aaa";
            hint.style.marginTop = "5px";
            modalActions.appendChild(hint);
        }
    }
}

modalClose.addEventListener('click', ()=> { modal.setAttribute('aria-hidden','true'); });
modal.addEventListener('click', (ev) => {
    if(ev.target === modal) modal.setAttribute('aria-hidden','true');
});

// Continuous Snowfall Generator
function createSnowfall(n){
    for(let i=0;i<n;i++){
        const f = document.createElement('div');
        f.className='snowflake';
        const size = 5 + Math.random() * 7;
        f.style.width = size + 'px';
        f.style.height = size + 'px';
        f.style.left = Math.random() * 100 + 'vw';
        f.style.animationDuration = (5 + Math.random() * 10) + 's';
        f.style.animationDelay = (Math.random() * 5) + 's';
        f.style.opacity = 0.4 + Math.random() * 0.6;
        document.body.appendChild(f);
    }
}
