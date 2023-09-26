import { plans } from "./plans";

const removeWatermarkFeature = (plan: string) =>
  plans.find((i) => i.id === plan)!.limits.removeWatermark
    ? "Remove Watermark"
    : undefined;
const apiAccessFeature = (plan: string) =>
  plans.find((i) => i.id === plan)!.limits.apiAccess ? "API Access" : undefined;
const prioritySupportFeature = (plan: string) =>
  plans.find((i) => i.id === plan)!.limits.prioritySupport
    ? "Priority support"
    : undefined;
const chatbotCountFeature = (plan: string) =>
  plans.find((i) => i.id === plan)!.limits.chatbots === "unlimited"
    ? "Unlimited chatbots"
    : `Up to ${plans
        .find((i) => i.id === plan)!
        .limits.chatbots.toLocaleString()} chatbot${
        plans.find((i) => i.id === plan)!.limits.chatbots === 1 ? "" : "s"
      }`;
const linkCountFeature = (plan: string) =>
  plans.find((i) => i.id === plan)!.limits.links === "unlimited"
    ? "Unlimited links"
    : `Up to ${plans
        .find((i) => i.id === plan)!
        .limits.links.toLocaleString()} link${
        plans.find((i) => i.id === plan)!.limits.links === 1 ? "" : "s"
      }`;
const documentCountFeature = (plan: string) =>
  plans.find((i) => i.id === plan)!.limits.documents === "unlimited"
    ? "Unlimited documents"
    : `Up to ${plans
        .find((i) => i.id === plan)!
        .limits.documents.toLocaleString()} document${
        plans.find((i) => i.id === plan)!.limits.documents === 1 ? "" : "s"
      }`;
const teamMemberCountFeature = (plan: string) =>
  plans.find((i) => i.id === plan)!.limits.teamMembers === "unlimited"
    ? "Unlimited team members"
    : `Up to ${plans
        .find((i) => i.id === plan)!
        .limits.teamMembers.toLocaleString()} team member${
        plans.find((i) => i.id === plan)!.limits.documents === 1 ? "" : "s"
      }`;
const messagesPerMonthCountFeature = (plan: string) =>
  plans.find((i) => i.id === plan)!.limits.messagesPerMonth === "unlimited"
    ? "Unlimited AI messages/mo"
    : `Up to ${plans
        .find((i) => i.id === plan)!
        .limits.messagesPerMonth.toLocaleString()} AI message${
        plans.find((i) => i.id === plan)!.limits.messagesPerMonth === 1
          ? ""
          : "s"
      }/mo`;
const customizationFeature = (plan: string) =>
  `${
    plans.find((i) => i.id === plan)!.limits.advancedCustomization
      ? "Advanced"
      : "Basic"
  } customization`;

export type Feature = {
  items: Record<string, string | undefined>;
  explaination?: string;
};

export const features: Feature[] = [
  {
    items: {
      starter: chatbotCountFeature("starter"),
      team: chatbotCountFeature("team"),
      business: chatbotCountFeature("business"),
      enterprise: chatbotCountFeature("enterprise"),
    },
  },
  {
    items: {
      starter: linkCountFeature("starter"),
      team: linkCountFeature("team"),
      business: linkCountFeature("business"),
      enterprise: linkCountFeature("enterprise"),
    },
  },
  {
    items: {
      starter: documentCountFeature("starter"),
      team: documentCountFeature("team"),
      business: documentCountFeature("business"),
      enterprise: documentCountFeature("enterprise"),
    },
  },
  {
    items: {
      starter: messagesPerMonthCountFeature("starter"),
      team: messagesPerMonthCountFeature("team"),
      business: messagesPerMonthCountFeature("business"),
      enterprise: messagesPerMonthCountFeature("enterprise"),
    },
  },
  {
    items: {
      starter: teamMemberCountFeature("starter"),
      team: teamMemberCountFeature("team"),
      business: teamMemberCountFeature("business"),
      enterprise: teamMemberCountFeature("enterprise"),
    },
  },
  {
    items: {
      starter: customizationFeature("starter"),
      team: customizationFeature("team"),
      business: customizationFeature("business"),
      enterprise: customizationFeature("enterprise"),
    },
  },
  {
    items: {
      starter: removeWatermarkFeature("starter"),
      team: removeWatermarkFeature("team"),
      business: removeWatermarkFeature("business"),
      enterprise: removeWatermarkFeature("enterprise"),
    },
  },
  {
    items: {
      starter: apiAccessFeature("starter"),
      team: apiAccessFeature("team"),
      business: apiAccessFeature("business"),
      enterprise: apiAccessFeature("enterprise"),
    },
    explaination: "Under development. ETA: December 2023",
  },
  {
    items: {
      starter: prioritySupportFeature("starter"),
      team: prioritySupportFeature("team"),
      business: prioritySupportFeature("business"),
      enterprise: prioritySupportFeature("enterprise"),
    },
    explaination: "Email & chat support within 24 hours.",
  },
];
