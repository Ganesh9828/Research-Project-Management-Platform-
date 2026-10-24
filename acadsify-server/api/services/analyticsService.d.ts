declare module '../../api/services/analyticsService' {
    export const getAnalyticsData: () => Promise<{
        totalUsers: number;
        totalCourses: number;
        totalAppointments: number;
    }>;
}
