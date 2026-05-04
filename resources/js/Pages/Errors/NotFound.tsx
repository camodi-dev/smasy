import ErrorLayout from "@/layouts/ErrorLayout";
import { SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <ErrorLayout
            code={404}
            title="Page Not Found"
            description="The page you are looking for doesn't exist or has been moved. Please check the URL or go back to the dashboard."
            icon={<SearchX className="w-10 h-10 text-destructive" />}
        />
    );
}