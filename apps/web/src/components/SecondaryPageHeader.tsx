export interface SecondaryPageHeaderProps {
  title: string;
  subtitle?: string;
}

const SecondaryPageHeader = ({ title, subtitle }: SecondaryPageHeaderProps) => {
  return (
    <div>
      <h1 className="text-xl font-semibold">{title}</h1>
      {!!subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default SecondaryPageHeader;
