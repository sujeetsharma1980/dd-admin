import React from "react";
import {
  CalendarIcon,
  DocumentPlusIcon,
  FolderIcon,
  HomeIcon,
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
    label: "Categories",
    href: "/categories/view",
    icon: <DocumentPlusIcon className="w-6 h-6" />,
  },
  {
    label: "Deals",
    href: "/deals/view",
    icon: <DocumentPlusIcon className="w-6 h-6" />,
  },
];