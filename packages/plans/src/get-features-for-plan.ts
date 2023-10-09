import { allPlans } from "./plans";
import { PlanFeature } from "./types";

export const getFeaturesForPlan = (planId: string): PlanFeature[] => {
  const plan = allPlans.find((plan) => plan.id === planId);
  if (!plan) return [];
  return [
    {
      text: `${
        plan.limits.chatbots === "unlimited"
          ? "Unlimited"
          : `Up to ${plan.limits.chatbots.toLocaleString()}`
      } chatbot${
        plan.limits.chatbots === "unlimited" || plan.limits.chatbots > 1
          ? "s"
          : ""
      }`,
    },
    {
      text: `${
        plan.limits.links === "unlimited"
          ? "Unlimited"
          : `Up to ${plan.limits.links.toLocaleString()}`
      } link${
        plan.limits.links === "unlimited" || plan.limits.links > 1 ? "s" : ""
      }`,
    },
    {
      text: `${
        plan.limits.documents === "unlimited"
          ? "Unlimited"
          : `Up to ${plan.limits.documents.toLocaleString()}`
      } document${
        plan.limits.documents === "unlimited" || plan.limits.documents > 1
          ? "s"
          : ""
      }`,
    },
    {
      text: `${
        plan.limits.messagesPerMonth === "unlimited"
          ? "Unlimited"
          : `Up to ${plan.limits.messagesPerMonth.toLocaleString()}`
      } AI messages/mo`,
    },
    {
      text: `${
        plan.limits.teamMembers === "unlimited"
          ? "Unlimited"
          : `Up to ${plan.limits.teamMembers.toLocaleString()}`
      } team members`,
    },
    {
      text: `${
        plan.limits.advancedCustomization ? "Advanced" : "Basic"
      } customization`,
    },
    ...(plan.limits.apiAccess
      ? [
          {
            text: `API Access`,
            explanation: `Under development. ETA: December 2023`,
          },
        ]
      : []),
    ...(plan.limits.prioritySupport
      ? [
          {
            text: `Priority support`,
            explanation: `Email & chat support within 24 hours.`,
          },
        ]
      : []),
  ];
};
