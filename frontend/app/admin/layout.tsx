import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/admin-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Sidebar */}
      <Sidebar>
        <AppSidebar />
      </Sidebar>

      {/* Sidebar trigger */}
      <SidebarTrigger />

      {/* Main content */}
      <SidebarInset className="p-6">{children}</SidebarInset>
    </SidebarProvider>
  );
}