// Lysa's Advent Calendar - client-side only
const CALENDAR_DAYS = 24;
const calendar = document.getElementById('calendar');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalActions = document.getElementById('modal-actions');
const modalClose = document.getElementById('modal-close');

const TODAY = new Date();
const currentDay = TODAY.getDate(); // user's local day of month

// Utility
const pad = n => String(n).padStart(2,'0');

// Load days metadata
let daysData = {};
fetch('data/days.json')
    .then(r => r.json())
    .then(d => { daysData = d || {}; buildCalendar(); })
    .catch(err => { console.warn('Could not load data/days.json — using empty placeholders.'); buildCalendar(); });

function buildCalendar(){
    for(let i=1;i<=CALENDAR_DAYS;i++){
        const dayNum = pad(i);
        const dayEl = document.createElement('button');
        dayEl.className = 'day';
        dayEl.setAttribute('data-day', dayNum);
        dayEl.setAttribute('aria-label', 'Day ' + dayNum);
        dayEl.innerHTML = `<span class="num">${i}</span>`;

        // Mark opened if stored
        const opened = localStorage.getItem('lisa-day-' + dayNum) === '1';
        if(opened) dayEl.classList.add('opened');

        // locked if future day (strict: if i > currentDay on current month)
        // You can comment out the 'if' below for testing purposes
        if(i > currentDay){
            dayEl.classList.add('locked');
            dayEl.disabled = true;
        } else {
            dayEl.addEventListener('click', onDayClick);
        }

        // if day has 'badge' show it
        if(daysData[dayNum] && daysData[dayNum].badge){
            const b = document.createElement('span'); b.className='badge'; b.textContent = daysData[dayNum].badge;
            dayEl.appendChild(b);
        }

        calendar.appendChild(dayEl);
    }

    // create subtle snowfall
    createSnowfall(18);
}

function onDayClick(e){
    const day = e.currentTarget.getAttribute('data-day');
    openDay(day);
}

function openDay(day){
    const meta = daysData[day] || {};
    // If password protected (Client-side fun only)
    if(meta.password){
        const attempt = prompt('This day is password protected — please enter the password:');
        if(attempt === null) return;
        if(attempt !== meta.password){
            alert('Incorrect password.');
            return;
        }
    }

    // mark opened in localStorage
    localStorage.setItem('lisa-day-' + day, '1');
    const btn = document.querySelector('.day[data-day=\"'+day+'\"]');
    if(btn) btn.classList.add('opened');

    modal.setAttribute('aria-hidden','false');
    modalTitle.textContent = meta.title || ('Day ' + day);
    modalBody.innerHTML = '';
    modalActions.innerHTML = '';

    // 1. Show Text Message
    if(meta.text){
        const p = document.createElement('p');
        p.textContent = meta.text;
        p.style.fontSize = "1.1rem";
        p.style.lineHeight = "1.6";
        modalBody.appendChild(p);
    }

    // 2. Handle Google Drive Links (The "Secure Gift")
    if(meta.link && meta.link.includes('drive.google.com')){
        const driveBtn = document.createElement('a');
        driveBtn.href = meta.link;
        driveBtn.target = '_blank';
        driveBtn.rel = 'noopener';
        driveBtn.className = 'drive-button'; // specific styling

        // Add a Google Drive icon or generic gift icon using emoji or SVG
        driveBtn.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; background:#fff; color:#333; padding:12px 20px; border-radius:8px; font-weight:bold; margin-top:15px; text-decoration:none;">
                <span>🎁</span>
                <span>Open Secret Gift on Google Drive</span>
            </div>
        `;
        modalActions.appendChild(driveBtn);

        const note = document.createElement('p');
        note.style.fontSize = "0.85rem";
        note.style.color = "#ccc";
        note.style.marginTop = "8px";
        note.textContent = "(You need to be logged into your Google account to view this)";
        modalActions.appendChild(note);
    }
    // 3. Handle Standard Direct Links (e.g. YouTube, Spotify)
    else if(meta.link) {
        const la = document.createElement('a');
        la.href = meta.link;
        la.target='_blank';
        la.rel='noopener';
        la.textContent = meta.linkText || 'Open Link';
        la.style.display='inline-block';
        la.style.marginTop='10px';
        la.style.color = '#ffd54f';
        modalActions.appendChild(la);
    }
}

modalClose.addEventListener('click', ()=> { modal.setAttribute('aria-hidden','true'); });

modal.addEventListener('click', (ev) => {
    if(ev.target === modal) modal.setAttribute('aria-hidden','true');
});

function createSnowfall(n){
    for(let i=0;i<n;i++){
        const f = document.createElement('div');
        f.className='snowflake';
        const size = 6 + Math.random()*18;
        f.style.width = f.style.height = size + 'px';
        f.style.left = Math.random()*100 + 'vw';
        f.style.animationDuration = (8 + Math.random()*10) + 's';
        f.style.opacity = 0.5 + Math.random()*0.7;
        f.style.fontSize = size + 'px';
        f.style.transform = 'translateY(-10vh)';
        f.style.background = 'radial-gradient(circle at 40% 30%, rgba(255,255,255,0.95), rgba(255,255,255,0.65))';
        f.style.borderRadius = '50%';
        document.body.appendChild(f);
    }
}
