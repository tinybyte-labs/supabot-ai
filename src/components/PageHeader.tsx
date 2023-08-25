export interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <header className="pb-8 pt-16">
      <div className="container flex items-center gap-4">
        <h1 className="text-3xl font-semibold">{title}</h1>
      </div>
    </header>
  );
};

export default PageHeader;
