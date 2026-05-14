import { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Sidebar } from './Sidebar';
import type { TabKey } from '../pages/Employee/types';

interface MainLayoutProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function MainLayout({
  activeTab,
  onTabChange,
  onLogout,
  children,
}: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (tab: TabKey) => {
    onTabChange(tab);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={onLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile Header */}
        {isMobile && (
          <AppBar 
            position="static" 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={() => setSidebarOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '0.5px' }}>
                Workforce Pro
              </h1>
            </Toolbar>
          </AppBar>
        )}

        {/* Page Content - Scrollable */}
        <Box
          sx={{
            flex: 1,
            p: isMobile ? 2 : 3,
            overflow: 'auto',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            scrollBehavior: 'smooth',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(102, 126, 234, 0.4)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.6)',
              },
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
