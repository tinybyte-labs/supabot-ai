import { ReactNode } from "react";

export interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

const PageHeader = ({ title, children }: PageHeaderProps) => {
  return (
    <header className="my-16">
      <div className="container flex items-center gap-4">
        <h1 className="flex-1 text-3xl font-semibold">{title}</h1>
        {children}
      </div>
    </header>
  );
};

export default PageHeader;
