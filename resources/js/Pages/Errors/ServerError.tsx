import ErrorLayout from "@/layouts/ErrorLayout";
import { ServerCrash } from "lucide-react";

export default function ServerError() {
    return (
        <ErrorLayout
            code={500}
            title="Server Error"
            description="Something went wrong on our end. Please try again later or contact support if the problem persists."
            icon={<ServerCrash className="w-10 h-10 text-destructive" />}
        />
    );
}