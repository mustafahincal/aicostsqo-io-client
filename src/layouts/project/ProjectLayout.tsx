import Sidebar from "@/components/sidebar/Sidebar";
import React from "react";

interface ProjectLayoutProps {
  children?: React.ReactNode;
}

const MemoizedSidebar = React.memo(Sidebar);

const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  return (
    <div className="flex justify-between w-full gap-10 py-10 px-14">
      <MemoizedSidebar />
      <div className="w-3/4 flex flex-col gap-10 flex-shrink-0">{children}</div>
    </div>
  );
};

export default ProjectLayout;
