import React, { createContext, useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, BarChart2, Users, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "../components/ui/button";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

const Sidebar: React.FC = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, text: 'Dashboard', link: '/dashboard' },
    { icon: BarChart2, text: 'Reports', link: '/reports' },
    { icon: Users, text: 'Disputes', link: '/disputes' },
    { icon: Settings, text: 'Settings', link: '/settings' },
    { icon: HelpCircle, text: 'Help', link: '/help' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ width: 250 }}
      animate={{ width: isCollapsed ? 80 : 250 }}
      className={`bg-gray-900 text-white h-screen fixed left-0 top-0 z-50 flex flex-col justify-between`}
    >
      <div>
        <div className="p-5 flex justify-between items-center">
          {!isCollapsed && <h2 className="text-2xl font-bold">Referral Admin</h2>}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-gray-800"
          >
            {isCollapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
          </Button>
        </div>
        <nav>
          <ul>
            {menuItems.map((item, index) => (
              <motion.li
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.link}
                  className={`flex items-center p-4 hover:bg-gray-800 transition-colors duration-200 ${
                    location.pathname === item.link ? 'bg-gray-800' : ''
                  }`}
                >
                  <item.icon className="mr-3" size={20} />
                  {!isCollapsed && <span>{item.text}</span>}
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="p-5">
        <Button
          variant="ghost"
          className="w-full text-white hover:bg-gray-800 justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-3" size={20} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </motion.div>
  );
};

export default Sidebar;

