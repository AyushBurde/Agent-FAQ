// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    fetch('/api/faqs')
      .then(res => res.json())
      .then(data => setFaqs(data));
  }, []);

  return (
    <main>
      <h1>FAQs</h1>
      <ul>
        {faqs.map((faq, i) => (
          <li key={i}>
            <strong>Q:</strong> {faq.question}<br />
            <strong>A:</strong> {faq.answer}
          </li>
        ))}
      </ul>
    </main>
  );
}
