"use client";
import { useAdminAuthStore } from "@/lib/store/authAdminStore";

export const usePermissions = () => {
  const { permissions, hasPermission } = useAdminAuthStore();
  
  const checkPermission = (permissionKey) => hasPermission(permissionKey);
  
  const getPermissions = () => permissions;
  
  const canAccessDashboard = () => checkPermission('dashboard');
  const canManageApplications = () => checkPermission('manage_application');
  const canManageAdmin = () => checkPermission('manage_admin');
  const canViewReports = () => checkPermission('disburse_reporting');
  const canViewCollections = () => checkPermission('collection_reporting');
  const canManageBlogs = () => checkPermission('blogs');
  const canSendSMS = () => checkPermission('send_sms');
  
  return {
    permissions,
    checkPermission,
    getPermissions,
    canAccessDashboard,
    canManageApplications,
    canManageAdmin,
    canViewReports,
    canViewCollections,
    canManageBlogs,
    canSendSMS,
  };
};