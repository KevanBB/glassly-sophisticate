
export const mockNotifications = [
  { id: 1, title: 'New match request', message: 'DomMaster97 sent you a match request', time: '2m ago', read: false },
  { id: 2, title: 'Message received', message: 'You have a new message from SubLover23', time: '1h ago', read: false },
  { id: 3, title: 'Profile view', message: 'Your profile was viewed by 3 people today', time: '3h ago', read: true },
];

export const mockActivity = [
  { id: 1, type: 'login', message: 'Last login 2 hours ago', time: '2h ago' },
  { id: 2, type: 'message', message: 'Sent 5 messages today', time: '4h ago' },
  { id: 3, type: 'profile', message: 'Updated your preferences', time: '1d ago' },
];

export const mockMatches = [
  { id: 1, name: 'DomMaster97', type: 'Dom', compatibility: 95, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'SubLover23', type: 'Sub', compatibility: 88, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'KinkExplorer', type: 'Switch', compatibility: 82, avatar: 'https://i.pravatar.cc/150?img=3' },
];

export const quickActions = [
  { id: 1, title: 'Find Match', icon: 'Search', color: 'bg-brand' },
  { id: 2, title: 'Messages', icon: 'MessageCircle', color: 'bg-green-500' },
  { id: 3, title: 'Edit Profile', icon: 'User', color: 'bg-purple-500' },
  { id: 4, title: 'Preferences', icon: 'Settings', color: 'bg-amber-500' },
];

export const recentTributes = [
  { id: 1, amount: 25, recipient: 'DomMaster97', date: '2 days ago', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, amount: 10, recipient: 'SubLover23', date: '1 week ago', avatar: 'https://i.pravatar.cc/150?img=2' },
];
