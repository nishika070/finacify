// ============================================================
// WHAT WE LEARNED TODAY — QUICK NOTES
// ============================================================
//
// 1. WHY db.json + json-server?
//    localStorage sirf usi browser mein rehta hai.
//    db.json ek real file hai — json-server use serve karta hai
//    taaki koi bhi browser fetch karke data le sake.
//
// 2. WHY A SERVER AT ALL?
//    Browser security rule — browser directly kisi file ko
//    read/write NAHI kar sakta apne computer pe.
//    json-server ek middleman hai:
//    Browser <-- fetch --> json-server <-- read/write --> db.json
//
// 3. WHAT IS json-server?
//    Ek npm package hai — kisi ne likha, npm pe upload kiya.
//    Tum download karte ho: npm install -g json-server
//    Aur run karte ho: npx json-server db.json --port 3000
//    Yeh automatically GET, POST, DELETE, PUT sab handle karta hai.
//    Koi server file likhne ki zaroorat nahi!
//
// 4. WHAT IS A PROMISE?
//    fetch() turant data nahi deta — network time leta hai.
//    Toh fetch() ek Promise return karta hai.
//    Promise ke 3 states hain:
//      - pending   → abhi wait ho raha hai
//      - fulfilled → data aa gaya
//      - rejected  → kuch galat hua (file not found etc.)
//
// 5. METHOD 1 — .then() chain
//    fetch("url")
//      .then(function(response) { return response.json(); })
//      .then(function(data) { /* use data here */ })
//      .catch(function(error) { /* handle error */ });
//    .then() tab run hota hai jab Promise fulfill ho.
//    .catch() tab run hota hai jab kuch galat ho.
//
// 6. METHOD 2 — async/await (same thing, cleaner syntax)
//    async function load() {
//      const res  = await fetch("url");   // envelope aaya
//      const data = await res.json();     // envelope khola
//      return data;
//    }
//    await = "ruk jao yahan, Promise finish hone do, phir value do"
//    await sirf async function ke ANDAR kaam karta hai.
//
// 7. WHY TWO AWAITS?
//    fetch()        → Response object deta hai (sirf envelope)
//    response.json()→ envelope kholke actual data deta hai
//    Dono async hain, isliye dono pe await lagta hai.
//
// 8. GOLDEN RULE
//    Jo bhi code data USE karta hai, woh async function ke
//    ANDAR hona chahiye. Bahar data exist hi nahi karta abhi.
//
// 9. POST REQUEST — data save karna
//    await fetch("url", {
//      method: "POST",
//      headers: { "Content-Type": "application/json" },
//      body: JSON.stringify(object)
//    });
//    json-server automatically db.json mein likh deta hai!
//    id bhi khud generate karta hai — tum mat dena.
//
// 10. TOP LEVEL AWAIT PROBLEM
//     async function ke bahar seedha await nahi likh sakte.
//     Isliye hamesha ek init() function banao aur call karo.
//
// ============================================================

