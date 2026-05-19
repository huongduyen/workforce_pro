import type { TabKey } from "../../types/navigation";
import PeopleIcon from '@mui/icons-material/People';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventNoteIcon from '@mui/icons-material/EventNote';

export interface SidebarItem {
  key: TabKey;
  label: string;
  icon: React.ElementType;
}

export interface SidebarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
}

export const sidebarItems: SidebarItem[] = [
  {
    key: 'employees',
    label: 'Employees',
    icon: PeopleIcon,
  },
  {
    key: 'departments',
    label: 'Departments',
    icon: BusinessIcon,
  },
  {
    key: 'attendance',
    label: 'Attendance',
    icon: CheckCircleIcon,
  },
  {
    key: 'leave',
    label: 'Leave Requests',
    icon: EventNoteIcon,
  },
];
