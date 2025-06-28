
import { useState } from "react";
import { 
  BarChart, 
  LineChart, 
  PieChart, 
  AreaChart,
  ResponsiveContainer, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Bar, 
  Line, 
  Pie, 
  Area,
  Cell
} from "recharts";
import { 
  ArrowUp, 
  ArrowDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

// Sample data for charts
const monthlySales = [
  { name: "Jan", sales: 5000 },
  { name: "Feb", sales: 6200 },
  { name: "Mar", sales: 8100 },
  { name: "Apr", sales: 7200 },
  { name: "May", sales: 9000 },
  { name: "Jun", sales: 11000 },
  { name: "Jul", sales: 10200 },
  { name: "Aug", sales: 12500 },
  { name: "Sep", sales: 13800 },
  { name: "Oct", sales: 16000 },
  { name: "Nov", sales: 14500 },
  { name: "Dec", sales: 18000 }
];

const categoryData = [
  { name: "Furniture", value: 35 },
  { name: "Electronics", value: 25 },
  { name: "Kitchen", value: 20 },
  { name: "Decor", value: 15 },
  { name: "Other", value: 5 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const dailySales = [
  { day: "Monday", sales: 1200, orders: 45 },
  { day: "Tuesday", sales: 1800, orders: 68 },
  { day: "Wednesday", sales: 1600, orders: 56 },
  { day: "Thursday", sales: 2000, orders: 73 },
  { day: "Friday", sales: 2400, orders: 92 },
  { day: "Saturday", sales: 1900, orders: 71 },
  { day: "Sunday", sales: 1100, orders: 43 }
];

const topSellers = [
  { name: "Jane Doe", sales: 32500, products: 15, growth: 18 },
  { name: "John Smith", sales: 28700, products: 12, growth: -5 },
  { name: "Alex Johnson", sales: 25400, products: 8, growth: 12 },
  { name: "Maria Garcia", sales: 21900, products: 10, growth: 8 },
  { name: "Robert Chen", sales: 19200, products: 7, growth: 15 }
];

const AdminSalesAnalytics = () => {
  const [timeRange, setTimeRange] = useState("year");
  
  // Calculate totals and percentages for metrics
  const totalSales = monthlySales.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = dailySales.reduce((sum, item) => sum + item.orders, 0);
  const totalCustomers = 850; // Sample data
  const avgOrderValue = totalSales / totalOrders;
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center mb-8">
          <Link to="/admin-dashboard" className="flex items-center text-foreground/70 hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold ml-auto">Sales Analytics</h1>
          <div className="ml-auto flex items-center">
            <span className="mr-2">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2 rounded-full p-2 bg-primary/10">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
                  <div className="text-xs flex items-center text-green-600">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>12% from last period</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Total Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2 rounded-full p-2 bg-primary/10">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalOrders}</div>
                  <div className="text-xs flex items-center text-green-600">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>8% from last period</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Customers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2 rounded-full p-2 bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalCustomers}</div>
                  <div className="text-xs flex items-center text-green-600">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    <span>15% from last period</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                Avg. Order Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className="mr-2 rounded-full p-2 bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</div>
                  <div className="text-xs flex items-center text-red-500">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    <span>3% from last period</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="sellers">Top Sellers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Monthly Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        width={500}
                        height={300}
                        data={monthlySales}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Area type="monotone" dataKey="sales" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Sales ($)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            
              <Card>
                <CardHeader>
                  <CardTitle>Daily Sales Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={dailySales}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="sales" fill="#8884d8" name="Sales ($)" />
                        <Bar yAxisId="right" dataKey="orders" fill="#82ca9d" name="Orders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales Growth Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        width={500}
                        height={300}
                        data={monthlySales}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value}`} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="sales" 
                          stroke="#8884d8" 
                          activeDot={{ r: 8 }} 
                          name="Sales ($)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={400} height={400}>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Category Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={categoryData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip formatter={(value) => `${value}%`} />
                        <Legend />
                        <Bar dataKey="value" fill="#8884d8" name="Category Share (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sellers">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-4 px-4">Seller</th>
                        <th className="text-left py-4 px-4">Total Sales</th>
                        <th className="text-left py-4 px-4">Products</th>
                        <th className="text-left py-4 px-4">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSellers.map((seller, index) => (
                        <tr key={index} className="border-b border-border">
                          <td className="py-4 px-4">
                            <div className="font-medium">{seller.name}</div>
                          </td>
                          <td className="py-4 px-4">
                            ${seller.sales.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            {seller.products}
                          </td>
                          <td className="py-4 px-4">
                            <div className={`flex items-center ${
                              seller.growth > 0 ? "text-green-600" : "text-red-500"
                            }`}>
                              {seller.growth > 0 ? (
                                <ArrowUp className="mr-1 h-4 w-4" />
                              ) : (
                                <ArrowDown className="mr-1 h-4 w-4" />
                              )}
                              {Math.abs(seller.growth)}%
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-8 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={topSellers}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value, name) => name === "sales" ? `$${value}` : value} />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  );
};

export default AdminSalesAnalytics;
