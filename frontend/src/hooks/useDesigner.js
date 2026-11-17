import { useApp } from '../context/AppContext';

export const useDesigner = () => {
  const { profile, updateProfileData, isOnline, toggleOnlineStatus } = useApp();
  return {
    profile,
    updateProfileData,
    isOnline,
    toggleOnlineStatus,
  };
};

export default useDesigner;
