import ErrorLayout from "@/layouts/ErrorLayout";
import { ShieldX } from "lucide-react";

export default function Forbidden() {
    return (
        <ErrorLayout
            code={403}
            title="Access Forbidden"
            description="You don't have permission to access this page. Please contact your administrator if you think this is a mistake."
            icon={<ShieldX className="w-10 h-10 text-destructive" />}
        />
    );
}