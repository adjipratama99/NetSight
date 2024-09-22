import { FaExclamationCircle, FaFileAlt, FaHome } from "react-icons/fa";

export default function MenuList() {
    return [
        {
            label: 'Dashboard',
            accessKey: 'dashboard',
            link: '/dashboard',
            icon: <FaHome />
        }, {
            label: 'Alert',
            accessKey: 'alerts',
            link: '/alerts',
            icon: <FaExclamationCircle />
        }, {
            label: 'Report',
            accessKey: 'reports',
            link: '/reports',
            icon: <FaFileAlt />
        }
    ]
}