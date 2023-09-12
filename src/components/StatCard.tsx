import { ReactNode } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: ReactNode;
  value: ReactNode;
  icon: ReactNode;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <span className="h-4 w-4 text-muted-foreground">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
