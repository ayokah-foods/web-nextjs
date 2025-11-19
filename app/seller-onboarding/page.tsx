import OnboardingLayout from "./components/OnboardingLayout";
import StepBankInfo from "./components/StepBankInfo";
import StepImages from "./components/StepImages";
import StepShopInfo from "./components/StepShopInfo";
import StepSubscription from "./components/StepSubscription";


export default function OnboardingPage() {
  return (
    <OnboardingLayout
      steps={[
        { id: 1, label: "Shop Info", component: <StepShopInfo /> },
        { id: 2, label: "Bank Info", component: <StepBankInfo /> },
        { id: 3, label: "Shop Images", component: <StepImages shopId={1}  /> },
        { id: 4, label: "Shop Sub", component: <StepSubscription  /> },
      ]}
    />
  );
}
