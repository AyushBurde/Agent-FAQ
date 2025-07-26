import React from "react";

function FAQTable({ faqs, onDelete }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">📋 FAQ List ({faqs.length})</h2>
      {faqs.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <div className="text-gray-500 text-lg mb-2">No FAQs found</div>
          <div className="text-gray-400 text-sm">Add your first FAQ using the form above</div>
        </div>
      ) : (
        <table className="min-w-full border text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Question</th>
              <th className="p-2 border">Answer</th>
              <th className="p-2 border">Created</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq._id}>
                <td className="p-2 border">{faq.question}</td>
                <td className="p-2 border max-w-xs truncate">{faq.answer}</td>
                <td className="p-2 border text-xs text-gray-500">
                  {new Date(faq.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => onDelete(faq._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FAQTable;
