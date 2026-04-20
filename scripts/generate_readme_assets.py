from pathlib import Path


OUT = Path(__file__).resolve().parent.parent / "assets"
OUT.mkdir(parents=True, exist_ok=True)


def write(name: str, body: str) -> None:
    (OUT / name).write_text(body, encoding="utf-8")


write(
    "hero-orbit.svg",
    """<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#0b1020"/>
    <stop offset="55%" stop-color="#131d39"/>
    <stop offset="100%" stop-color="#20112d"/>
  </linearGradient>
  <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="#ff7b83" stop-opacity="0.28"/>
    <stop offset="100%" stop-color="#4e7bff" stop-opacity="0.18"/>
  </linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#bg)"/>
<circle cx="320" cy="180" r="220" fill="#ff7b83" opacity="0.09"/>
<circle cx="1320" cy="740" r="250" fill="#58b5ff" opacity="0.10"/>
<rect x="110" y="120" width="610" height="660" rx="36" fill="url(#card)" stroke="rgba(255,255,255,0.12)"/>
<text x="160" y="230" fill="#eef2ff" font-size="66" font-family="Arial, sans-serif" font-weight="700">AI Spokesperson</text>
<text x="160" y="305" fill="#eef2ff" font-size="66" font-family="Arial, sans-serif" font-weight="700">&amp; Influencer Agency</text>
<text x="160" y="370" fill="#9fb0d8" font-size="30" font-family="Arial, sans-serif">Synthetic talent systems for SaaS, education, health, and high-trust brands.</text>
<text x="160" y="430" fill="#9fb0d8" font-size="30" font-family="Arial, sans-serif">Request. Classify. Approve. Deliver. Learn.</text>
<rect x="160" y="500" width="230" height="64" rx="18" fill="#ff7b83" opacity="0.92"/>
<text x="196" y="542" fill="#ffffff" font-size="28" font-family="Arial, sans-serif" font-weight="700">Governed SaaS</text>
<rect x="430" y="500" width="230" height="64" rx="18" fill="#263554" stroke="#7da0ff" opacity="0.92"/>
<text x="455" y="542" fill="#dfe8ff" font-size="28" font-family="Arial, sans-serif" font-weight="700">Cross-company bridge</text>
<g transform="translate(880,120)">
  <rect x="0" y="0" width="560" height="170" rx="28" fill="#10192f" stroke="#2a3b61"/>
  <text x="36" y="56" fill="#eef2ff" font-size="34" font-family="Arial, sans-serif" font-weight="700">Synthetic Talent Catalog</text>
  <text x="36" y="100" fill="#aab7d8" font-size="24" font-family="Arial, sans-serif">Original personas, disclosure classes, rights, and performance history</text>
  <text x="36" y="136" fill="#aab7d8" font-size="24" font-family="Arial, sans-serif">ready for Kurs.ing, TRT.ge, Lovkode, Personal, and external clients</text>
</g>
<g transform="translate(880,340)">
  <rect x="0" y="0" width="560" height="170" rx="28" fill="#10192f" stroke="#2a3b61"/>
  <text x="36" y="56" fill="#eef2ff" font-size="34" font-family="Arial, sans-serif" font-weight="700">Approval-first Fulfillment</text>
  <text x="36" y="100" fill="#aab7d8" font-size="24" font-family="Arial, sans-serif">Claims, likeness, sponsorship, and live interaction are classified up front</text>
  <text x="36" y="136" fill="#aab7d8" font-size="24" font-family="Arial, sans-serif">so every request reaches production with safe defaults already attached</text>
</g>
<g transform="translate(880,560)">
  <rect x="0" y="0" width="560" height="170" rx="28" fill="#10192f" stroke="#2a3b61"/>
  <text x="36" y="56" fill="#eef2ff" font-size="34" font-family="Arial, sans-serif" font-weight="700">Performance Feedback Loop</text>
  <text x="36" y="100" fill="#aab7d8" font-size="24" font-family="Arial, sans-serif">Every delivery returns trust, conversion, fatigue, and compliance learning</text>
  <text x="36" y="136" fill="#aab7d8" font-size="24" font-family="Arial, sans-serif">to both the agency company and the requesting company</text>
</g>
</svg>""",
)

write(
    "service-bridge.svg",
    """<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
<rect width="1600" height="900" fill="#0d1326"/>
<text x="110" y="110" fill="#eef2ff" font-size="54" font-family="Arial, sans-serif" font-weight="700">Cross-company service bridge</text>
<text x="110" y="160" fill="#9fb0d8" font-size="28" font-family="Arial, sans-serif">Other companies request outcomes. The agency fulfills them under governance.</text>
<g fill="#111a31" stroke="#31466f" stroke-width="2">
  <rect x="110" y="250" width="260" height="420" rx="28"/>
  <rect x="470" y="250" width="280" height="420" rx="28"/>
  <rect x="850" y="250" width="300" height="420" rx="28"/>
  <rect x="1250" y="250" width="240" height="420" rx="28"/>
</g>
<g font-family="Arial, sans-serif">
  <text x="150" y="310" fill="#ffffff" font-size="34" font-weight="700">Requesting company</text>
  <text x="150" y="372" fill="#aab7d8" font-size="24">1. Browse talent</text>
  <text x="150" y="414" fill="#aab7d8" font-size="24">2. Submit brief</text>
  <text x="150" y="456" fill="#aab7d8" font-size="24">3. Review disclosures</text>
  <text x="150" y="498" fill="#aab7d8" font-size="24">4. Approve or reject</text>
  <text x="150" y="540" fill="#aab7d8" font-size="24">5. Receive delivery</text>
  <text x="150" y="582" fill="#aab7d8" font-size="24">6. Feed back performance</text>

  <text x="510" y="310" fill="#ffffff" font-size="34" font-weight="700">Agency plugin</text>
  <text x="510" y="372" fill="#ffb2b7" font-size="24">Talent catalog</text>
  <text x="510" y="414" fill="#ffb2b7" font-size="24">Risk classifier</text>
  <text x="510" y="456" fill="#ffb2b7" font-size="24">Approval rules</text>
  <text x="510" y="498" fill="#ffb2b7" font-size="24">Work order desk</text>
  <text x="510" y="540" fill="#ffb2b7" font-size="24">Delivery locker</text>
  <text x="510" y="582" fill="#ffb2b7" font-size="24">Learning loop</text>

  <text x="890" y="310" fill="#ffffff" font-size="34" font-weight="700">Agency company</text>
  <text x="890" y="372" fill="#8fd6ff" font-size="24">Talent studio</text>
  <text x="890" y="414" fill="#8fd6ff" font-size="24">Script + media ops</text>
  <text x="890" y="456" fill="#8fd6ff" font-size="24">Disclosure + rights</text>
  <text x="890" y="498" fill="#8fd6ff" font-size="24">Localization</text>
  <text x="890" y="540" fill="#8fd6ff" font-size="24">Channel deployment</text>
  <text x="890" y="582" fill="#8fd6ff" font-size="24">Performance analysis</text>

  <text x="1285" y="310" fill="#ffffff" font-size="34" font-weight="700">Outcomes</text>
  <text x="1285" y="372" fill="#9fe5bf" font-size="24">Approved assets</text>
  <text x="1285" y="414" fill="#9fe5bf" font-size="24">Usage rights</text>
  <text x="1285" y="456" fill="#9fe5bf" font-size="24">Disclosure notes</text>
  <text x="1285" y="498" fill="#9fe5bf" font-size="24">Performance reports</text>
  <text x="1285" y="540" fill="#9fe5bf" font-size="24">Reusable talent fit</text>
</g>
<g stroke="#617db7" stroke-width="5" fill="none">
  <path d="M370 460 L470 460"/>
  <path d="M750 460 L850 460"/>
  <path d="M1150 460 L1250 460"/>
</g>
</svg>""",
)

write(
    "dashboard-preview.svg",
    """<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="960" viewBox="0 0 1600 960">
<rect width="1600" height="960" fill="#09111f"/>
<rect x="60" y="60" width="1480" height="840" rx="36" fill="#101a31" stroke="#2b3c60"/>
<rect x="110" y="110" width="1380" height="120" rx="24" fill="#162441"/>
<text x="150" y="182" fill="#eef2ff" font-size="42" font-family="Arial, sans-serif" font-weight="700">AI Spokesperson Agency</text>
<text x="770" y="182" fill="#9fb0d8" font-size="24" font-family="Arial, sans-serif">Synthetic talent SaaS for governed campaign intake and fulfillment</text>
<g fill="#131f39" stroke="#32486f">
  <rect x="110" y="280" width="300" height="170" rx="24"/>
  <rect x="445" y="280" width="300" height="170" rx="24"/>
  <rect x="780" y="280" width="300" height="170" rx="24"/>
  <rect x="1115" y="280" width="300" height="170" rx="24"/>
</g>
<g font-family="Arial, sans-serif">
  <text x="145" y="335" fill="#9fb0d8" font-size="22">Talent Profiles</text>
  <text x="145" y="400" fill="#ffffff" font-size="54" font-weight="700">12</text>
  <text x="480" y="335" fill="#9fb0d8" font-size="22">Active Requests</text>
  <text x="480" y="400" fill="#ffffff" font-size="54" font-weight="700">7</text>
  <text x="815" y="335" fill="#9fb0d8" font-size="22">Awaiting Approval</text>
  <text x="815" y="400" fill="#ffffff" font-size="54" font-weight="700">3</text>
  <text x="1150" y="335" fill="#9fb0d8" font-size="22">Delivered This Cycle</text>
  <text x="1150" y="400" fill="#ffffff" font-size="54" font-weight="700">18</text>
</g>
<g fill="#11192f" stroke="#2b3e67">
  <rect x="110" y="500" width="660" height="320" rx="28"/>
  <rect x="830" y="500" width="660" height="320" rx="28"/>
</g>
<g font-family="Arial, sans-serif">
  <text x="150" y="560" fill="#ffffff" font-size="34" font-weight="700">Talent Catalog</text>
  <text x="150" y="620" fill="#ffbec3" font-size="24">Nora Pulse — Trust-led Nordic educator</text>
  <text x="150" y="655" fill="#9fb0d8" font-size="22">Norwegian · English | paid social · onboarding · webinars</text>
  <text x="150" y="710" fill="#8dd1ff" font-size="24">Lev Vertex — Founder-style B2B closer</text>
  <text x="150" y="745" fill="#9fb0d8" font-size="22">English · Norwegian | demos · retargeting · launch video</text>

  <text x="870" y="560" fill="#ffffff" font-size="34" font-weight="700">Request Pipeline</text>
  <text x="870" y="620" fill="#ffffff" font-size="24">Launch spokesperson SaaS explainer campaign</text>
  <text x="870" y="655" fill="#9fb0d8" font-size="22">classified · Norway + UK · paid social, landing pages, webinars</text>
  <text x="870" y="710" fill="#ffffff" font-size="24">TRT.ge educational host refresh</text>
  <text x="870" y="745" fill="#9fb0d8" font-size="22">awaiting_approval · health-sensitive · disclosure + script review</text>
</g>
</svg>""",
)

print("Generated sales assets in assets/")

