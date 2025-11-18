import OnboardingLayout from "./components/OnboardingLayout";
import StepBankInfo from "./components/StepBankInfo";
import StepDocuments from "./components/StepDocuments";
import StepShopInfo from "./components/StepShopInfo";


export default function OnboardingPage() {
  return (
    <OnboardingLayout
      steps={[
        { id: 1, label: "Shop Information", component: <StepShopInfo /> },
        { id: 2, label: "Bank Info", component: <StepBankInfo /> },
        { id: 3, label: "Documents", component: <StepDocuments /> },
      ]}
    />
  );
}
