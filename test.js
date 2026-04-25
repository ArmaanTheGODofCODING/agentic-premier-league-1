const apiKey = 'AIzaSyBjuMWqt30i0CDj5qGk4gVZNEGWDp9mNZA';

async function test() {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: "hi" }] }] })
    });
    console.log(res.status);
    const data = await res.json();
    console.log(JSON.stringify(data).substring(0, 50));
}
test();
