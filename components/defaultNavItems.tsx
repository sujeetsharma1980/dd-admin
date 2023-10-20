import React from "react";
import {
  CalendarIcon,
  DocumentPlusIcon,
  FolderIcon,
  HomeIcon,
  PencilIcon,
  SignalIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { NavItem } from "./Sidebar";

export const defaultNavItems: NavItem[] = [
  
  {
    label: "Brands",
    href: "/brands/view",
    icon: <DocumentPlusIcon className="w-6 h-6" />,
  },
  {
    label: "Stores",
    href: "/stores/view",
    icon: <DocumentPlusIcon className="w-6 h-6" />,
  },
  {
    label: "Categories",
    href: "/categories/view",
    icon: <DocumentPlusIcon className="w-6 h-6" />,
  },
  {
    label: "Deals",
    href: "/deals/view",
    icon: <DocumentPlusIcon className="w-6 h-6" />,
  },
  {
    label: "Blogs",
    href: "/blogs/view",
    icon: <DocumentPlusIcon className="w-6 h-6" />,
  },
  {
    label: "On Demand Deployment",
    href: "/deploy",
    icon: <SignalIcon className="w-6 h-6" />,
  },
  {
    label: "Bulk Uploader",
    href: "/bulkuploader",
    icon: <SignalIcon className="w-6 h-6" />,
  },
  {
    label: "File Manager",
    href: "/filemanager",
    icon: <SignalIcon className="w-6 h-6" />,
  },
  {
    label: "Privacy",
    href: "/privacy",
    icon: <PencilIcon className="w-6 h-6" />,
  },
];