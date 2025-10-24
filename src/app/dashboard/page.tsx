"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/stores/auth"
import { usePurchaseStore } from "@/stores/purchases"
import { Purchase, Warranty, ReturnPolicy, Alert } from "@/types"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Plus, Shield, Clock, DollarSign, Bell, Upload } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore()
  const { purchases, warranties, returnPolicies, alerts, isLoading, setPurchases, setWarranties, setReturnPolicies, setAlerts, setLoading } = usePurchaseStore()
  const [stats, setStats] = useState({
    totalPurchases: 0,
    activeWarranties: 0,
    activeReturns: 0,
    upcomingAlerts: 0,
    totalSavings: 0,
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [purchasesRes, warrantiesRes, returnPoliciesRes, alertsRes] = await Promise.all([
        fetch("/api/purchases"),
        fetch("/api/warranties"),
        fetch("/api/return-policies"),
        fetch("/api/alerts")
      ])
      
      const [purchasesData, warrantiesData, returnPoliciesData, alertsData] = await Promise.all([
        purchasesRes.json(),
        warrantiesRes.json(),
        returnPoliciesRes.json(),
        alertsRes.json()
      ])
      
      if (purchasesData.success) {
        setPurchases(purchasesData.data)
        calculateStats(purchasesData.data, warrantiesData.data || [], returnPoliciesData.data || [], alertsData.data || [])
      }
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (purchasesData: Purchase[], warrantiesData: Warranty[], returnPoliciesData: ReturnPolicy[], alertsData: Alert[]) => {
    const activeWarranties = warrantiesData.filter(w => w.isActive && new Date(w.expiresAt) > new Date()).length
    const activeReturns = returnPoliciesData.filter(r => r.isActive && new Date(r.expiresAt) > new Date()).length
    const upcomingAlerts = alertsData.filter(a => a.isActive && !a.isRead && new Date(a.scheduledFor) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).length
    
    // Calculate potential savings from warranties and returns
    const totalSavings = purchasesData.reduce((sum, purchase) => {
      const warranties = warrantiesData.filter(w => w.purchaseId === purchase.id && w.isActive)
      const returns = returnPoliciesData.filter(r => r.purchaseId === purchase.id && r.isActive)
      
      let savings = 0
      if (warranties.length > 0) savings += purchase.purchasePrice * 0.5 // Assume 50% of purchase price could be saved
      if (returns.length > 0) savings += purchase.purchasePrice * 0.8 // Assume 80% could be returned
      
      return sum + savings
    }, 0)

    setStats({
      totalPurchases: purchasesData.length,
      activeWarranties,
      activeReturns,
      upcomingAlerts,
      totalSavings,
    })
  }

  if (!isAuthenticated) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Welcome to Brand Hack Finder</h1>
        <p className="text-muted-foreground">Sign in to start tracking your purchases and discovering hidden brand benefits.</p>
        <Button asChild>
          <Link href="/auth/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brand Hack Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Track your purchases and never miss out on brand benefits.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/purchases/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload Receipt
            </Link>
          </Button>
          <Button asChild>
            <Link href="/purchases/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Purchase
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPurchases}</div>
            <p className="text-xs text-muted-foreground">
              Items tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Warranties</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeWarranties}</div>
            <p className="text-xs text-muted-foreground">
              Protection active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Return Windows</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReturns}</div>
            <p className="text-xs text-muted-foreground">
              Still available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Alerts</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAlerts}</div>
            <p className="text-xs text-muted-foreground">
              This week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalSavings)}</div>
            <p className="text-xs text-muted-foreground">
              From benefits
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchases */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Purchases</CardTitle>
          <CardDescription>
            Your latest tracked purchases with brand benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading purchases...</div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <p className="text-muted-foreground">No purchases tracked yet. Start by adding your first purchase!</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button asChild>
                  <Link href="/purchases/new">Add Your First Purchase</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/purchases/upload">Upload Receipt</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.slice(0, 5).map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h3 className="font-medium">{purchase.title}</h3>
                    <p className="text-sm text-muted-foreground">{purchase.brand} - {purchase.productName}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">
                        {formatCurrency(purchase.purchasePrice)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Purchased: {formatDate(purchase.purchaseDate)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="flex gap-2">
                      {warranties.filter(w => w.purchaseId === purchase.id && w.isActive).length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Warranty Active
                        </span>
                      )}
                      {returnPolicies.filter(r => r.purchaseId === purchase.id && r.isActive).length > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Return Available
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Explore Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Discover brand policies and hidden benefits
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/brands">Browse Brand Database</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upload Receipt</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Let AI extract brand information from your receipts
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/purchases/upload">Upload Receipt</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">View Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Check upcoming warranty and return deadlines
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/alerts">View All Alerts</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
