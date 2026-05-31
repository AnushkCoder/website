// Harness Radar — build-time data baker.
// Runs in GitHub Actions with the built-in GITHUB_TOKEN (1000 req/hr, no PAT needed).
// Fetches total stars + recent star deltas (7d / 30d) per repo and writes a static JSON
// that coding-harness-watchlist.html reads on "Start Search". No secret ever reaches the browser.
import { writeFileSync } from 'node:fs';

// Curated watchlist — repo full names mirror the SEED list in the HTML.
const REPOS = [
  'anomalyco/opencode', 'openai/codex', 'OpenHands/OpenHands', 'cline/cline',
  'earendil-works/pi', 'aaif-goose/goose', 'Aider-AI/aider', 'continuedev/continue',
  'QwenLM/qwen-code', 'charmbracelet/crush', 'Kilo-Org/kilocode', 'plandex-ai/plandex',
  'tailcallhq/forgecode', 'gptme/gptme', 'truffle-ai/dexto', 'vinhnx/vtcode',
];

const token = process.env.GH_TOKEN;
const base = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'harness-radar',
  'X-GitHub-Api-Version': '2022-11-28',
};
const star = { ...base, Accept: 'application/vnd.github.star+json' };
if (token) {
  base.Authorization = 'Bearer ' + token;
  star.Authorization = 'Bearer ' + token;
} else {
  console.warn('No GH_TOKEN set — running unauthenticated (60 req/hr). Deltas may be partial.');
}

const now = Date.now();
const D7 = now - 7 * 864e5;
const D30 = now - 30 * 864e5;
const out = {};

for (const repo of REPOS) {
  try {
    const metaRes = await fetch(`https://api.github.com/repos/${repo}`, { headers: base });
    if (!metaRes.ok) {
      console.error(`meta ${repo}: HTTP ${metaRes.status}`);
      continue;
    }
    const m = await metaRes.json();
    const stars = m.stargazers_count;
    const rec = {
      stars,
      forks: m.forks_count,
      created: m.created_at.slice(0, 10),
      pushed: m.pushed_at.slice(0, 10),
    };

    // Jump to the last pages of stargazers and count recent starred_at timestamps.
    const perPage = 100;
    const lastPage = Math.ceil(stars / perPage);
    const startPage = Math.min(lastPage, 400); // GitHub caps stargazer pagination at ~400 pages
    let d7 = 0, d30 = 0, capped = lastPage > 400;
    for (let pg = startPage; pg >= 1 && pg > startPage - 6; pg--) {
      const res = await fetch(`https://api.github.com/repos/${repo}/stargazers?per_page=100&page=${pg}`, { headers: star });
      if (!res.ok) {
        if (res.status === 422) capped = true;
        break;
      }
      const arr = await res.json();
      if (!Array.isArray(arr) || !arr.length) continue;
      let oldestOnPage = now;
      for (const s of arr) {
        const t = s.starred_at ? Date.parse(s.starred_at) : null;
        if (t == null) continue;
        oldestOnPage = Math.min(oldestOnPage, t);
        if (t >= D30) d30++;
        if (t >= D7) d7++;
      }
      // Once the oldest star on a page predates the 30d window, we've covered it.
      if (oldestOnPage < D30) break;
    }
    rec.d7 = d7;
    rec.d30 = d30;
    rec.capped = capped;
    out[repo] = rec;
    console.log(`${repo}: ${stars}★  +${d30}/30d  +${d7}/7d${capped ? '  (approx — pagination cap)' : ''}`);
  } catch (e) {
    console.error(`error ${repo}:`, e.message);
  }
}

const payload = { generated: new Date().toISOString(), repos: out };
writeFileSync('harness-radar-data.json', JSON.stringify(payload, null, 2) + '\n');
console.log(`\nwrote harness-radar-data.json — ${Object.keys(out).length}/${REPOS.length} repos`);
