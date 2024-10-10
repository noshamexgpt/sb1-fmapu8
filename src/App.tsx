import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Wallet, ArrowUpDown, Clock } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Transaction {
  id: string;
  orderId: string;
  asset: string;
  amount: number;
  price: number;
  time: number;
  isBuyer: boolean;
}

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Replace with your actual Binance API endpoint and add necessary authentication
        const response = await axios.get('https://api.binance.com/api/v3/myTrades', {
          headers: {
            'X-MBX-APIKEY': 'YOUR_API_KEY_HERE'
          }
        });
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch transactions. Please check your API key and try again.');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const chartData = {
    labels: transactions.map(t => format(new Date(t.time), 'MM/dd/yyyy')),
    datasets: [
      {
        label: 'Transaction Amount',
        data: transactions.map(t => t.amount),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Transaction History',
      },
    },
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Binance Transaction Information</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Wallet className="mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold">Total Transactions</h2>
          </div>
          <p className="text-3xl font-bold">{transactions.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <ArrowUpDown className="mr-2 text-green-500" />
            <h2 className="text-xl font-semibold">Latest Price</h2>
          </div>
          <p className="text-3xl font-bold">
            ${transactions[0]?.price.toFixed(2) || 'N/A'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center mb-4">
            <Clock className="mr-2 text-purple-500" />
            <h2 className="text-xl font-semibold">Last Transaction</h2>
          </div>
          <p className="text-xl">
            {transactions[0] ? format(new Date(transactions[0].time), 'MM/dd/yyyy HH:mm:ss') : 'N/A'}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">Transaction History Graph</h2>
        <Line options={chartOptions} data={chartData} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Asset</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="px-4 py-2">{format(new Date(transaction.time), 'MM/dd/yyyy HH:mm:ss')}</td>
                  <td className="px-4 py-2">{transaction.asset}</td>
                  <td className="px-4 py-2">{transaction.amount}</td>
                  <td className="px-4 py-2">${transaction.price.toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${transaction.isBuyer ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                      {transaction.isBuyer ? 'Buy' : 'Sell'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;