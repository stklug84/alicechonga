// Lysa's Advent Calendar
const CALENDAR_DAYS = 24;
const calendar = document.getElementById('calendar');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalActions = document.getElementById('modal-actions');
const modalClose = document.getElementById('modal-close');

// --- DATE CHECKING ---
const TODAY = new Date();
const currentDay = TODAY.getDate();
// Optional: Check month to ensure it only unlocks in December
const isDecember = TODAY.getMonth() === 11; // Month is 0-indexed (11 = Dec)

// Utility
const pad = n => String(n).padStart(2,'0');

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

        // Mark opened if stored in browser
        const opened = localStorage.getItem('lisa-day-' + dayNum) === '1';
        if(opened) dayEl.classList.add('opened');

        // --- LOCK LOGIC ---
        // Lock if the day number is greater than today's date
        // NOTE: Remove "&& isDecember" if you want to test it in other months
        if(i > currentDay){
            dayEl.classList.add('locked');
            dayEl.setAttribute('title', 'Available on December ' + i);
            dayEl.disabled = true;
        } else {
            dayEl.addEventListener('click', onDayClick);
        }

        // Add badge if exists
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

function onDayClick(e){
    const day = e.currentTarget.getAttribute('data-day');
    openDay(day);
}

function openDay(day){
    const meta = daysData[day] || {};

    // --- NO PASSWORD CHECK ---
    // The password block has been removed.

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

        // Styling based on link type
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

        // Helper text for Drive
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

// Close Modal Events
modalClose.addEventListener('click', ()=> { modal.setAttribute('aria-hidden','true'); });
modal.addEventListener('click', (ev) => {
    if(ev.target === modal) modal.setAttribute('aria-hidden','true');
});

// Continuous Snowfall Generator
function createSnowfall(n){
    for(let i=0;i<n;i++){
        const f = document.createElement('div');
        f.className='snowflake';
        // Random size between 5px and 12px
        const size = 5 + Math.random() * 7;
        f.style.width = size + 'px';
        f.style.height = size + 'px';

        // Random horizontal start position (0 to 100vw)
        f.style.left = Math.random() * 100 + 'vw';

        // Random animation duration (5s to 15s) for varying speeds
        f.style.animationDuration = (5 + Math.random() * 10) + 's';

        // Random animation delay so they don't all start at once
        f.style.animationDelay = (Math.random() * 5) + 's';

        f.style.opacity = 0.4 + Math.random() * 0.6;
        document.body.appendChild(f);
    }
}
