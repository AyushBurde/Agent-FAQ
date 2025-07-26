import React, { useState } from "react";
import toast from 'react-hot-toast';

function FAQForm({ onAdd }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question || !answer) {
      toast.error('Please fill in both question and answer.');
      return;
    }
    onAdd({ question, answer });
    setQuestion("");
    setAnswer("");
    toast.success('FAQ added successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-2">➕ Add New FAQ</h2>
      <input
        type="text"
        placeholder="Question"
        className="w-full p-2 border rounded mb-2"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <textarea
        placeholder="Answer"
        className="w-full p-2 border rounded mb-2"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add FAQ
      </button>
    </form>
  );
}

export default FAQForm;
