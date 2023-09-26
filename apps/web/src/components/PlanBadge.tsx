import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { Plan } from "@/types/plan";

const PlanBadge = ({ plan }: { plan: Plan }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge className="ml-2">{plan.name}</Badge>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        You are on the {plan.name} plan.
      </TooltipContent>
    </Tooltip>
  );
};

export default PlanBadge;
