import React from "react";

export default function DataDeletion() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-6 text-4xl font-bold">Data Deletion Instructions</h1>

      <p className="mb-4">
        Twinn Live respects your privacy. If you would like your account data
        removed from our application, please contact us using the details
        below.
      </p>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">
        How to request data deletion
      </h2>

      <ol className="list-decimal space-y-2 pl-6">
        <li>Send an email to <b>support@twinn.live</b>.</li>
        <li>Use the subject: <b>Delete My Account</b>.</li>
        <li>Include the email address used to register with Twinn Live.</li>
        <li>We will permanently delete your data within 30 days.</li>
      </ol>

      <h2 className="mt-8 mb-3 text-2xl font-semibold">
        What data is deleted?
      </h2>

      <ul className="list-disc space-y-2 pl-6">
        <li>Profile information</li>
        <li>Connected social accounts</li>
        <li>AI Twin information</li>
        <li>Uploaded training data</li>
        <li>Products</li>
        <li>Analytics related to your account</li>
      </ul>

      <p className="mt-8">
        For questions, contact us at <b>support@twinn.live</b>.
      </p>
    </div>
  );
}