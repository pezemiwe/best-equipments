import React, { useMemo } from 'react';
import { Box, Flex, SimpleGrid, Text } from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

const ACCENT = '#2563eb';
const STATUS_COLORS: Record<string, string> = {
  pending: '#ecc94b', // yellow.400
  confirmed: '#3182ce', // blue.500
  delivered: '#38a169', // green.500
  cancelled: '#e53e3e', // red.500
};

export const AnalyticsDashboard = ({ orders }: { orders: any[] }) => {
  const {
    totalRevenue,
    validOrdersCount,
    statusData,
    revenueData,
    topProductsData,
  } = useMemo(() => {
    if (!orders || orders.length === 0) {
      return {
        totalRevenue: 0,
        validOrdersCount: 0,
        statusData: [],
        revenueData: [],
        topProductsData: [],
      };
    }

    let revenue = 0;
    let validCount = 0;
    const statusCounts: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      delivered: 0,
      cancelled: 0,
    };

    const revByDate: Record<string, number> = {};
    const productSales: Record<string, number> = {};

    orders.forEach((order) => {
      // 1. Status counts
      const status = order.status || 'pending';
      statusCounts[status] = (statusCounts[status] || 0) + 1;

      // 2. Revenue and Valid Orders
      if (status !== 'cancelled') {
        revenue += Number(order.total) || 0;
        validCount++;

        // 3. Revenue over time
        const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        });
        revByDate[dateStr] = (revByDate[dateStr] || 0) + (Number(order.total) || 0);

        // 4. Top products
        (order.items || []).forEach((item: any) => {
          if (item.name) {
            productSales[item.name] = (productSales[item.name] || 0) + (Number(item.quantity) || 1);
          }
        });
      }
    });

    const statusChart = Object.keys(statusCounts)
      .filter((k) => statusCounts[k] > 0)
      .map((k) => ({
        name: k.charAt(0).toUpperCase() + k.slice(1),
        value: statusCounts[k],
        color: STATUS_COLORS[k] || '#a0aec0',
      }));

    const revChart = Object.keys(revByDate).map((date) => ({
      date,
      revenue: revByDate[date],
    }));

    const topProductsChart = Object.keys(productSales)
      .map((name) => ({ name, sales: productSales[name] }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5); // top 5

    return {
      totalRevenue: revenue,
      validOrdersCount: validCount,
      statusData: statusChart,
      revenueData: revChart,
      topProductsData: topProductsChart,
    };
  }, [orders]);

  const aov = validOrdersCount > 0 ? totalRevenue / validOrdersCount : 0;

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing="20px" mb="30px">
        <Box bg="white" p="24px" boxShadow="0 2px 8px rgba(0,0,0,0.05)" borderRadius="8px">
          <Text fontSize="14px" color="gray.500" mb="8px">Total Revenue (Valid Orders)</Text>
          <Text fontSize="28px" fontWeight="700" color="#0f172a" className="font-oswald">
            ₦{totalRevenue.toLocaleString()}
          </Text>
        </Box>
        <Box bg="white" p="24px" boxShadow="0 2px 8px rgba(0,0,0,0.05)" borderRadius="8px">
          <Text fontSize="14px" color="gray.500" mb="8px">Total Valid Orders</Text>
          <Text fontSize="28px" fontWeight="700" color="#0f172a" className="font-oswald">
            {validOrdersCount}
          </Text>
        </Box>
        <Box bg="white" p="24px" boxShadow="0 2px 8px rgba(0,0,0,0.05)" borderRadius="8px">
          <Text fontSize="14px" color="gray.500" mb="8px">Average Order Value</Text>
          <Text fontSize="28px" fontWeight="700" color="#0f172a" className="font-oswald">
            ₦{aov.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing="20px" mb="30px">
        <Box bg="white" p="24px" boxShadow="0 2px 8px rgba(0,0,0,0.05)" borderRadius="8px" h="380px">
          <Text fontSize="16px" fontWeight="600" mb="20px">Revenue Over Time</Text>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={revenueData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke={ACCENT} strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Flex h="100%" alignItems="center" justifyContent="center">
              <Text color="gray.400">Not enough data to display.</Text>
            </Flex>
          )}
        </Box>

        <Box bg="white" p="24px" boxShadow="0 2px 8px rgba(0,0,0,0.05)" borderRadius="8px" h="380px">
          <Text fontSize="16px" fontWeight="600" mb="20px">Order Statuses</Text>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Flex h="100%" alignItems="center" justifyContent="center">
              <Text color="gray.400">Not enough data to display.</Text>
            </Flex>
          )}
        </Box>
      </SimpleGrid>

      <Box bg="white" p="24px" boxShadow="0 2px 8px rgba(0,0,0,0.05)" borderRadius="8px" h="380px" w={{ base: "100%", lg: "calc(50% - 10px)" }}>
        <Text fontSize="16px" fontWeight="600" mb="20px">Top Selling Products (Units)</Text>
        {topProductsData.length > 0 ? (
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={topProductsData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                width={150}
                tick={{ fontSize: 12 }} 
                tickFormatter={(val) => val.length > 20 ? val.substring(0, 20) + '...' : val}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="sales" fill={ACCENT} radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Flex h="100%" alignItems="center" justifyContent="center">
            <Text color="gray.400">Not enough data to display.</Text>
          </Flex>
        )}
      </Box>
    </Box>
  );
};
