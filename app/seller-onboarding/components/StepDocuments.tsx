export default function StepDocuments() {
  return (
    <form className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Business Documents</h2>

      <input type="file" className="input" />

      <input type="file" className="input" />

      <button type="submit" className="btn-primary w-full">
        Submit for Approval
      </button>
    </form>
  );
}
