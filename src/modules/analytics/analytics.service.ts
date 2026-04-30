import User from "../auth/User.model";
import Order from "../payment/Order.model";
import Product from "../products/Product.model";

export const getAnalytics = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const salesData = await Order.aggregate([
    {
      $match: { status: "paid" },
    },
    {
      $group: {
        _id: null, // Group all documents together
        totalSales: { $sum: 1 }, // Count the number of orders
        totalRevenue: { $sum: "$totalAmount" }, // Sum up the total amounts
      },
    },
  ]);
  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);
  startDate.setHours(0, 0, 0, 0); // Start from the beginning of the day 6 days ago
  const recentSalesData = await Order.aggregate([
    {
      $match: {
        status: "paid",
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        sales: { $sum: 1 }, // Count the number of orders for each day
        revenue: { $sum: "$totalAmount" }, // Sum up the total amounts for each day
      },
    },
    {
      $sort: {
        _id: 1, // Sort by date in ascending order
      },
    },
  ]);
  return {
    totalUsers,
    totalProducts,
    totalSales,
    totalRevenue,
    recentSalesData,
  };
};
