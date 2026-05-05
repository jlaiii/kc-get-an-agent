
// ─── Config ───
const CONFIG = {
  emailSpeed: 1500,
  calendarSpeed: 1200,
  swarmSpeed: 1800,
};

// ─── Scroll Reveal ───
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal, .feature-card').forEach(el => obs.observe(el));
}

// ─── Counter Animation ───
function animateCounters() {
  const el = document.getElementById('hrs-saved');
  if (!el) return;
  let n = 0, target = 42;
  const iv = setInterval(() => {
    n += 2;
    el.textContent = n;
    if (n >= target) clearInterval(iv);
  }, 60);
}

// ─── Email Demo (in card) ───
function initEmailMini() {
  const container = document.getElementById('email-demo');
  if (!container) return;
  const emails = [
    { sender: 'Boss', subject: 'Q2 report due Friday', tag: 'review', tagText: 'FLAGGED' },
    { sender: 'Amazon', subject: 'Your order has shipped', tag: 'auto', tagText: 'AUTO-ARCHIVED' },
    { sender: 'Client', subject: 'Invoice #4421 attached', tag: 'done', tagText: 'DRAFTED REPLY' },
  ];
  let idx = 0;
  function tick() {
    if (idx >= emails.length) idx = 0;
    container.innerHTML = '';
    const e = emails[idx];
    const div = document.createElement('div');
    div.className = 'email-line';
    div.innerHTML = `<span class="email-sender">${e.sender}</span><span class="email-subj">${e.subject}</span><span class="email-tag tag-${e.tag}">${e.tagText}</span>`;
    container.appendChild(div);
    idx++;
  }
  tick();
  setInterval(tick, 2200);
}

// ─── Calendar Mini Demo (in card) ───
function initCalendarMini() {
  const container = document.getElementById('calendar-demo');
  if (!container) return;
  const events = [
    { t: '9:00', text: 'Conflict detected → moved to 10:30', cls: 'agent' },
    { t: '2:00', text: 'Lunch with Sarah booked', cls: 'meeting' },
    { t: '4:00', text: 'Flight reminder set', cls: 'personal' },
  ];
  let idx = 0;
  function tick() {
    if (idx >= events.length) idx = 0;
    container.innerHTML = '';
    const e = events[idx];
    const div = document.createElement('div');
    div.className = 'cal-event';
    div.innerHTML = `<span style="color:var(--accent);font-family:var(--mono);min-width:45px">${e.t}</span><span style="color:var(--fg)">${e.text}</span>`;
    container.appendChild(div);
    idx++;
  }
  tick();
  setInterval(tick, 2500);
}

// ─── Agent Spawn Mini Demo ───
function initAgentSpawnMini() {
  const container = document.getElementById('agent-spawn-demo');
  if (!container) return;
  const msgs = [
    'Spawning Research Agent...',
    'Spawning Code Review Agent...',
    'Spawning Writing Agent...',
    'Merging results...',
  ];
  let idx = 0;
  function tick() {
    if (idx >= msgs.length) idx = 0;
    container.innerHTML = '';
    const div = document.createElement('div');
    div.className = 'agent-node';
    div.innerHTML = `<span style="color:var(--accent)">⚡</span><span style="color:var(--fg)">${msgs[idx]}</span>`;
    container.appendChild(div);
    idx++;
  }
  tick();
  setInterval(tick, 1800);
}

// ─── Full Calendar Section ───
function initCalendarSection() {
  const calBody = document.getElementById('cal-body');
  const log = document.getElementById('agent-log');
  if (!calBody || !log) return;

  const hours = Array.from({ length: 12 }, (_, i) => i + 7); // 7AM - 6PM
  const events = [
    { hour: 8, dur: 1, text: 'Standup', type: 'meeting' },
    { hour: 9, dur: 2, text: 'Deep Work — Agent shields all notifications', type: 'agent' },
    { hour: 12, dur: 1, text: 'Lunch w/ Sarah', type: 'personal' },
    { hour: 14, dur: 1, text: 'Client Call', type: 'meeting' },
    { hour: 15, dur: 1, text: 'Conflict: 2 meetings → Agent rescheduled one', type: 'conflict' },
    { hour: 16, dur: 1, text: 'Flight check-in auto-completed', type: 'agent' },
  ];

  // Render skeleton
  calBody.innerHTML = '';
  hours.forEach(h => {
    const row = document.createElement('div');
    row.className = 'cal-row';
    row.dataset.hour = h;
    const time = h <= 12 ? `${h}:00 ${h < 12 ? 'AM' : 'PM'}` : `${h - 12}:00 PM`;
    row.innerHTML = `<div class="cal-time-col">${time}</div><div class="cal-event-col" data-hour="${h}"></div>`;
    calBody.appendChild(row);
  });

  // Agent log messages
  const logMessages = [
    { t: '6:00 AM', msg: 'Agent woke up. Scanning calendar.' },
    { t: '6:05 AM', msg: 'Conflict found: 3:00 PM double-booked. Rescheduling...' },
    { t: '6:08 AM', msg: 'Moved "Review" to 5:00 PM. Notified attendees.' },
    { t: '6:10 AM', msg: 'Flight check-in opens at 4:00 PM. Reminder set.' },
    { t: '6:12 AM', msg: '3 emails auto-drafted. Awaiting your approval.' },
    { t: '8:00 AM', msg: 'Standup starting. DND enabled.' },
    { t: '9:00 AM', msg: 'Deep work block. All notifications silenced.' },
    { t: '12:00 PM', msg: 'Lunch with Sarah confirmed. Reservation held.' },
  ];

  let logIdx = 0;
  function addLog() {
    if (logIdx >= logMessages.length) logIdx = 0;
    const m = logMessages[logIdx];
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">${m.t}</span> ${m.msg}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
    logIdx++;
  }

  // Render events one by one
  let evtIdx = 0;
  function renderNextEvent() {
    if (evtIdx >= events.length) {
      setTimeout(() => { evtIdx = 0; clearEvents(); }, 4000);
      return;
    }
    const e = events[evtIdx];
    const col = calBody.querySelector(`.cal-event-col[data-hour="${e.hour}"]`);
    if (col) {
      const block = document.createElement('div');
      block.className = `cal-event-block ${e.type}`;
      block.textContent = e.text;
      block.style.top = '0';
      block.style.height = `${e.dur * 100}%`;
      col.appendChild(block);
    }
    addLog();
    evtIdx++;
    setTimeout(renderNextEvent, 1400);
  }

  function clearEvents() {
    calBody.querySelectorAll('.cal-event-block').forEach(b => b.remove());
    log.innerHTML = '';
    logIdx = 0;
    setTimeout(renderNextEvent, 800);
  }

  // Intersection trigger
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        renderNextEvent();
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  obs.observe(document.getElementById('calendar-section'));
}

// ─── Agent Swarm Section ───
function initAgentSwarm() {
  const swarm = document.getElementById('agent-swarm');
  const svg = document.getElementById('swarm-svg');
  const timeline = document.getElementById('swarm-timeline');
  if (!swarm || !svg || !timeline) return;

  const satNodes = swarm.querySelectorAll('.sat-node');
  const roles = ['Flights', 'Hotels', 'Itinerary', 'Visa', 'Budget'];
  const positions = [
    { top: '10%', left: '15%' },
    { top: '10%', left: '70%' },
    { top: '75%', left: '10%' },
    { top: '75%', left: '75%' },
    { top: '50%', left: '85%' },
  ];

  satNodes.forEach((node, i) => {
    if (window.innerWidth > 768) {
      node.style.top = positions[i].top;
      node.style.left = positions[i].left;
    }
  });

  // Draw SVG lines
  function drawLines() {
    if (window.innerWidth <= 768) return;
    const core = swarm.querySelector('.node-core').getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    const cx = core.left + core.width / 2 - svgRect.left;
    const cy = core.top + core.height / 2 - svgRect.top;

    let paths = '';
    satNodes.forEach(node => {
      const r = node.getBoundingClientRect();
      const nx = r.left + r.width / 2 - svgRect.left;
      const ny = r.top + r.height / 2 - svgRect.top;
      paths += `<line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="var(--border-hover)" stroke-width="1" opacity="0.6"/>`;
    });
    svg.innerHTML = paths;
  }

  drawLines();
  window.addEventListener('resize', drawLines);

  // Timeline steps
  const steps = [
    { num: 1, text: 'You say: "Plan my trip to Tokyo"', sub: 'Coordinator receives request' },
    { num: 2, text: 'Flights Agent searches Skyscanner, Kayak, Google Flights', sub: '3 options found: $680–$920' },
    { num: 3, text: 'Hotels Agent checks Booking, Airbnb, Agoda', sub: '5 properties match your filters' },
    { num: 4, text: 'Itinerary Agent builds day-by-day plan', sub: 'Restaurants, transit, walking routes mapped' },
    { num: 5, text: 'Visa Agent checks requirements', sub: 'No visa needed. Passport valid.' },
    { num: 6, text: 'Budget Agent totals everything', sub: 'Estimate: $2,340 for 7 days' },
    { num: 7, text: 'Coordinator merges all results', sub: 'One clean briefing delivered to you' },
  ];

  timeline.innerHTML = '';
  steps.forEach((s, i) => {
    const step = document.createElement('div');
    step.className = 'timeline-step';
    step.dataset.idx = i;
    step.innerHTML = `
      <div class="step-num">${s.num}</div>
      <div class="step-text">${s.text}<small>${s.sub}</small></div>
    `;
    timeline.appendChild(step);
  });

  // Animation sequence
  function runSwarm() {
    const allSteps = timeline.querySelectorAll('.timeline-step');
    allSteps.forEach(s => { s.classList.remove('visible', 'done'); });
    satNodes.forEach(n => n.classList.remove('active'));

    let stepIdx = 0;
    function advance() {
      if (stepIdx >= allSteps.length) {
        setTimeout(runSwarm, 5000);
        return;
      }
      const s = allSteps[stepIdx];
      s.classList.add('visible', 'done');

      // Highlight corresponding satellite
      const roleMap = [null, 'Flights', 'Hotels', 'Itinerary', 'Visa', 'Budget', null];
      if (roleMap[stepIdx]) {
        satNodes.forEach(n => {
          if (n.dataset.role === roleMap[stepIdx]) n.classList.add('active');
          else n.classList.remove('active');
        });
      }
      if (stepIdx === 0 || stepIdx === 6) {
        // coordinator phases — light them all briefly
        satNodes.forEach(n => n.classList.add('active'));
      }
      stepIdx++;
      setTimeout(advance, CONFIG.swarmSpeed);
    }
    advance();
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        runSwarm();
        obs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  obs.observe(document.getElementById('agents'));
}

// ─── Email Client Section ───
function initEmailClient() {
  const list = document.getElementById('email-list');
  if (!list) return;

  const emails = [
    { from: 'Sarah Kim', preview: 'Can we move our meeting to Thursday?', avatar: 'SK', action: 'DRAFT REPLY', aclass: 'action-reply' },
    { from: 'AWS Billing', preview: 'Your monthly invoice is ready: $142.30', avatar: 'AW', action: 'AUTO-PAID', aclass: 'action-delegate' },
    { from: 'Unknown', preview: 'URGENT: You won a free iPad!!!', avatar: '?', action: 'SPAM', aclass: 'action-spam' },
    { from: 'Dev Team', preview: 'PR #442 needs your review — 3 files changed', avatar: 'DT', action: 'FLAGGED', aclass: 'action-draft' },
    { from: 'Mom', preview: 'Dinner this Sunday? Dad is making ribs.', avatar: 'M', action: 'DRAFT REPLY', aclass: 'action-reply' },
  ];

  function renderEmails() {
    list.innerHTML = '';
    emails.forEach((e, i) => {
      const item = document.createElement('div');
      item.className = 'email-item';
      item.style.animationDelay = `${i * 0.15}s`;
      item.innerHTML = `
        <div class="email-avatar">${e.avatar}</div>
        <div class="email-meta">
          <div class="email-from">${e.from}</div>
          <div class="email-preview">${e.preview}</div>
        </div>
        <div class="email-action ${e.aclass}">${e.action}</div>
      `;
      list.appendChild(item);
    });
  }

  function cycleActions() {
    const items = list.querySelectorAll('.email-item');
    items.forEach((item, i) => {
      const actionEl = item.querySelector('.email-action');
      if (!actionEl) return;
      const actions = ['DRAFTED', 'SENT', 'ARCHIVED', 'DONE'];
      let aidx = 0;
      setInterval(() => {
        aidx = (aidx + 1) % actions.length;
        actionEl.textContent = actions[aidx];
        actionEl.className = `email-action ${actions[aidx] === 'SENT' ? 'action-reply' : actions[aidx] === 'DONE' ? 'action-draft' : 'action-delegate'}`;
      }, 3000 + i * 500);
    });
  }

  renderEmails();

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        cycleActions();
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });
  obs.observe(document.getElementById('email-section'));
}

// ─── Glitch Effect ───
function initGlitch() {
  const h1 = document.querySelector('.glitch');
  if (!h1) return;
  const original = h1.dataset.text;
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  let frame = 0;
  function glitch() {
    if (frame % 5 === 0) {
      const pos = Math.floor(Math.random() * original.length);
      const char = chars[Math.floor(Math.random() * chars.length)];
      h1.textContent = original.slice(0, pos) + char + original.slice(pos + 1);
    } else if (frame % 5 === 2) {
      h1.textContent = original;
    }
    frame++;
    requestAnimationFrame(glitch);
  }
  glitch();
}

// ─── Initialize ───
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  animateCounters();
  initEmailMini();
  initCalendarMini();
  initAgentSpawnMini();
  initCalendarSection();
  initAgentSwarm();
  initEmailClient();
  initGlitch();
});
