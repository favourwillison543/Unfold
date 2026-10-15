// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { FiPlus, FiSearch } from "react-icons/fi";
// import { useProjects } from "@/hooks/useProject";
// import ProjectCard from "./ProjectCard";

// type ProjectSidebarProps = {
//   currentProjectId?: number;
//   className?: string;
// };

// export default function ProjectSidebar({
//   currentProjectId,
//   className = "",
// }: ProjectSidebarProps) {
//   const [search, setSearch] = useState("");
//   const { data: projects = [], isLoading } = useProjects();

//   const filteredProjects = projects.filter((project) =>
//     project.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <aside
//       className={`w-full lg:w-80 shrink-0 border border-neutral-200 rounded-2xl p-4 bg-white flex flex-col min-h-[400px] lg:min-h-[600px] shadow-xs ${className}`}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between pb-4">
//         <span className="text-xs font-semibold bg-neutral-100 border border-neutral-200 rounded-lg px-2.5 py-1 text-neutral-900">
//           My projects
//         </span>

//         <Link
//           href="/project/new"
//           className="p-1.5 rounded-lg bg-brand hover:bg-brand/90 text-white transition-colors"
//         >
//           <FiPlus className="w-4 h-4" />
//         </Link>
//       </div>

//       {/* Search */}
//       <div className="relative mb-4">
//         <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search projects..."
//           className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-brand/50 transition-colors"
//         />
//       </div>

//       {/* Project List Stream */}
//       <div className="flex-1 max-h-[calc(100vh-16rem)] overflow-y-auto space-y-2 pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
//         <span className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider px-1 block mb-2">
//           Recent
//         </span>

//         {isLoading ? (
//           <p className="text-xs text-neutral-400 px-1 py-2">Loading projects...</p>
//         ) : filteredProjects.length > 0 ? (
//           filteredProjects.map((project) => (
//             <ProjectCard
//               key={project.id}
//               project={project}
//               isActive={project.id === currentProjectId}
//             />
//           ))
//         ) : (
//           <p className="text-xs text-neutral-400 px-1 italic py-2">
//             No projects found
//           </p>
//         )}
//       </div>
//     </aside>
//   );
// }