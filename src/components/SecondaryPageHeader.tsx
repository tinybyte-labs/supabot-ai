import { ReactNode } from "react";

export interface SecondaryPageHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const SecondaryPageHeader = ({
  title,
  subtitle,
  children,
}: SecondaryPageHeaderProps) => {
  return (
    <div>
      <h1 className="text-lg font-medium">{title}</h1>
      {!!subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
};

export default SecondaryPageHeader;
