import { formatDistanceToNow } from "date-fns";

const UserMessageBubble = ({
  message,
  name = "YOU",
  date,
  preview,
}: {
  message: string;
  name?: string;
  date?: Date;
  preview?: boolean;
}) => {
  return (
    <div className="flex justify-end pl-12">
      <div className="flex flex-col items-end">
        <p className="mb-1 text-sm font-medium uppercase text-muted-foreground">
          {name}
        </p>

        <div className="rounded-xl rounded-tr-sm bg-primary p-4 font-medium text-primary-foreground">
          {message}
        </div>
        {date && (
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDistanceToNow(date, { addSuffix: true })}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserMessageBubble;
