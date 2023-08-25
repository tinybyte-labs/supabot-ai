export interface PageHeaderProps {
  title: string;
}

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <header>
      <div className="container flex items-center gap-4 pb-4 pt-8">
        <h1 className="text-3xl font-semibold">{title}</h1>
      </div>
    </header>
  );
};

export default PageHeader;
