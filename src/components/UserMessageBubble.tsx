import { formatDistanceToNow } from "date-fns";

const UserMessageBubble = ({
  message,
  name = "YOU",
  date,
}: {
  message: string;
  name?: string;
  date?: Date;
}) => {
  return (
    <div className="flex justify-end pl-12 sm:pl-24">
      <div className="flex flex-col items-end">
        <div className="mb-2 flex items-center justify-end gap-3 text-right">
          {date && (
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true })}
            </p>
          )}
          <p className="text-sm font-medium uppercase text-muted-foreground">
            {name}
          </p>
        </div>
        <div className="rounded-2xl rounded-tr-sm bg-primary p-4 font-medium text-primary-foreground">
          {message}
        </div>
      </div>
    </div>
  );
};

export default UserMessageBubble;
