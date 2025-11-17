export default function StepBankInfo() {
  return (
    <form className="space-y-4">
      <h2 className="text-xl font-semibold mb-3">Bank Information</h2>

      <input className="input" placeholder="Bank Name" />

      <input className="input" placeholder="Account Holder Name" />

      <input className="input" placeholder="Account Number" />

      <button type="submit" className="btn-primary">
        Continue
      </button>
    </form>
  );
}
