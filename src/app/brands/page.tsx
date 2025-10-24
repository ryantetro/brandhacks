"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brand, BrandPolicy } from "@/types"
import { Search, Shield, Clock, DollarSign, ExternalLink } from "lucide-react"

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])

  useEffect(() => {
    fetchBrands()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = brands.filter(brand =>
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        brand.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredBrands(filtered)
    } else {
      setFilteredBrands(brands)
    }
  }, [searchTerm, brands])

  const fetchBrands = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/brands")
      const data = await response.json()
      
      if (data.success) {
        setBrands(data.data)
        setFilteredBrands(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch brands:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPolicyIcon = (type: string) => {
    switch (type) {
      case 'warranty':
        return <Shield className="h-4 w-4 text-blue-600" />
      case 'return':
        return <Clock className="h-4 w-4 text-green-600" />
      case 'price_protection':
        return <DollarSign className="h-4 w-4 text-purple-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const getPolicyColor = (type: string) => {
    switch (type) {
      case 'warranty':
        return 'bg-blue-100 text-blue-800'
      case 'return':
        return 'bg-green-100 text-green-800'
      case 'price_protection':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (days: number) => {
    if (days >= 999999) return 'Lifetime'
    if (days >= 365) return `${Math.round(days / 365)} year${Math.round(days / 365) > 1 ? 's' : ''}`
    if (days >= 30) return `${Math.round(days / 30)} month${Math.round(days / 30) > 1 ? 's' : ''}`
    return `${days} day${days > 1 ? 's' : ''}`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Brand Policies Database</h1>
          <p className="text-muted-foreground mt-2">Loading brand policies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Brand Policies Database</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover hidden warranties, return policies, and brand perks from hundreds of verified brands. 
          Find out what benefits you might be missing from your purchases.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search brands or policies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setSearchTerm("")}>
          Clear
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBrands.map((brand) => (
          <Card key={brand.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{brand.name}</CardTitle>
                {brand.isVerified && (
                  <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Verified
                  </div>
                )}
              </div>
              <CardDescription>{brand.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {brand.policies && brand.policies.length > 0 ? (
                <div className="space-y-3">
                  {brand.policies.map((policy: BrandPolicy) => (
                    <div key={policy.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center gap-2">
                        {getPolicyIcon(policy.type)}
                        <span className="font-medium text-sm">{policy.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getPolicyColor(policy.type)}`}>
                          {policy.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{policy.description}</p>
                      {policy.duration && (
                        <div className="text-xs text-muted-foreground">
                          Duration: {formatDuration(policy.duration)}
                        </div>
                      )}
                      {policy.conditions && (
                        <div className="text-xs text-muted-foreground">
                          <strong>Conditions:</strong> {policy.conditions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No policies available</p>
              )}
              
              {brand.website && (
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={brand.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBrands.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No brands found matching your search.</p>
        </div>
      )}

      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Don't See Your Brand?</h2>
        <p className="text-muted-foreground">
          We're constantly adding new brands and policies. Submit a brand request or help us verify policies.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button>
            Submit Brand Request
          </Button>
          <Button variant="outline">
            Help Verify Policies
          </Button>
        </div>
      </div>
    </div>
  )
}
