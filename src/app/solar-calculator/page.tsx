'use client'

import { useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function SolarCalculatorPage() {
  const { format } = useCurrency()
  const [area, setArea] = useState('')
  const [sunlight, setSunlight] = useState('')
  const [budget, setBudget] = useState('')
  const [result, setResult] = useState<null | {
    kw: number
    cost: number
    savings: number
    chartData: { year: string; savings: number }[]
  }>(null)
  const [loading, setLoading] = useState(false)

  // More realistic estimation logic
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      const areaNum = Number(area)
      const sunlightNum = Number(sunlight)
      const budgetNum = Number(budget)
      // Assume 1kW needs ~100 sq ft, and 1kW produces ~4 units/day
      const kw = Math.max(1, Math.round(areaNum / 100))
      const costPerKw = 45000
      const cost = kw * costPerKw
      // Annual savings: units per year * ₹10/unit
      const annualUnits = kw * sunlightNum * 365
      const annualSavings = Math.round(annualUnits * 10)
      // Chart: savings for 10 years, assume 3% increase in electricity price per year
      let chartData = []
      let yearlySavings = annualSavings
      for (let i = 1; i <= 10; i++) {
        chartData.push({ year: `Year ${i}`, savings: Math.round(yearlySavings) })
        yearlySavings *= 1.03
      }
      setResult({ kw, cost, savings: annualSavings, chartData })
      setLoading(false)
    }, 800)
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Solar Panel Savings Calculator</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-300">Estimate your solar installation size, cost, and annual savings. Enter your details below:</p>
      <form onSubmit={handleCalculate} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area Size (sq ft)</label>
          <input
            type="number"
            min="1"
            value={area}
            onChange={e => setArea(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Average Sunlight Hours/Day</label>
          <input
            type="number"
            min="1"
            max="12"
            value={sunlight}
            onChange={e => setSunlight(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Budget (₹)</label>
          <input
            type="number"
            min="0"
            value={budget}
            onChange={e => setBudget(e.target.value)}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Estimate Savings'}
        </button>
      </form>
      {result && (
        <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 text-center animate-fade-in">
          <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-200 mb-4">Your Estimate</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-4">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{result.kw} kW</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Estimated Capacity</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{format(result.cost)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Estimated Cost</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-700 dark:text-green-300">{format(result.savings)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Annual Savings</div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Projected Savings Over 10 Years</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={result.chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c7d2fe" />
                <XAxis dataKey="year" tick={{ fill: '#6366f1', fontSize: 12 }} />
                <YAxis tickFormatter={format} tick={{ fill: '#6366f1', fontSize: 12 }} />
                <Tooltip formatter={format} contentStyle={{ background: '#fff', borderRadius: 8, fontSize: 14 }} />
                <Bar dataKey="savings" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
} 