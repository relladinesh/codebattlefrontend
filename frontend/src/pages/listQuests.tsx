import { DashboardLayout } from "@/components/shared/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Map } from "lucide-react";
import React from "react";

function ListQuests() {
  return (
    <div>
      <DashboardLayout
        title="Quests"
        icon={<Map className="h-5 w-5 text-destructive" />}
        badge={
          <Badge variant="destructive" className="animate-pulse ml-2">
            LIVE
          </Badge>
        }
      >
        ListQuests
      </DashboardLayout>
    </div>
  );
}

export default ListQuests;
