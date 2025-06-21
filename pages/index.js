// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    fetch('/api/faqs')
      .then((res) => res.json())
      .then((data) => setFaqs(data));
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>📘 Hackathon FAQs</h1>
      {faqs.length === 0 ? (
        <p>Loading FAQs...</p>
      ) : (
        <ul style={{ paddingLeft: 0 }}>
          {faqs.map((faq, index) => (
            <li key={index} style={{ marginBottom: '1rem', listStyle: 'none' }}>
              <strong>Q:</strong> {faq.question}<br />
              <strong>A:</strong> {faq.answer}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

