import { Box, List, ListItemButton, ListItemIcon, ListItemText, Drawer, useMediaQuery, useTheme } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { sidebarItems, type SidebarProps } from './helpers';

export function Sidebar({
  activeTab,
  onTabChange,
  onLogout,
  open,
  onClose,
}: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'linear-gradient(180deg, #0f1419 0%, #1a1f2e 100%)',
        color: '#fff',
      }}
    >
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: 'none',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 700, letterSpacing: '0.5px' }}>
          Workforce Pro
        </h2>
        
      </Box>

      <List
        sx={{
        //   flex: 1,
          px: 1.5,
          py: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {sidebarItems.map((item) => (
          <ListItemButton
            key={item.key}
            onClick={() => {
              onTabChange(item.key);
              if (isMobile) onClose();
            }}
            sx={{
              px: 2.5,
              py: 1.75,
              borderRadius: '12px',
              bgcolor: activeTab === item.key ? 'rgba(102, 126, 234, 0.15)' : 'transparent',
              color: activeTab === item.key ? '#667eea' : '#a0a9b8',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              border: activeTab === item.key ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid transparent',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: activeTab === item.key ? '3px' : '0px',
                background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                transition: 'width 0.25s ease',
              },
              '&:hover': {
                bgcolor: 'rgba(102, 126, 234, 0.08)',
                color: '#667eea',
                transform: 'translateX(4px)',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: 'inherit',
                minWidth: 40,
                fontSize: '20px',
              }}
            >
              <item.icon />
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: activeTab === item.key ? 600 : 500,
                  fontSize: '14px',
                  letterSpacing: '0.3px',
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <ListItemButton
          onClick={onLogout}
          sx={{
            px: 2.5,
            py: 1.75,
            borderRadius: '12px',
            bgcolor: 'transparent',
            color: '#a0a9b8',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid transparent',
            '&:hover': {
              bgcolor: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              transform: 'translateX(4px)',
            },
          }}
        >
          <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: '14px',
                fontWeight: 500,
              },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  const drawerWidth = 260;

  if (isMobile) {
    return (
      <Drawer open={open} onClose={onClose}>
        <Box sx={{ width: drawerWidth }}>
          {content}
        </Box>
      </Drawer>
    );
  }

  return (
    <Box
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflow: 'hidden',
      }}
    >
      {content}
    </Box>
  );
}
