"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info, Search } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const services = [
 {
    name: "Advanced Data Integration",
    description: "Provides ability to design and execute tasks on big data engines (e.g. Spark) with advanced mapping designer and create reusable parameterized mappings/templates",
    unit: "Compute Units",
    metric: "Per Hour",
    levels: [{ min: 0, max: Infinity, ipu: 0.19 }]
  },
  {
    name: "Advanced Data Integration with Advanced Serverless",
    description: "Runs on Informatica-managed serverless Org and provides processing capacity of Advanced Data Integration jobs",
    unit: "Compute Units",
    metric: "Per Hour",
    levels: [{ min: 0, max: Infinity, ipu: 0.32 }]
  },
  {
    name: "Advanced Data Quality",
    description: "Enables design and execution of data quality tasks on big data engines using advanced mapping designer and data profiling Cloud Service. Includes rule specification dictionary cleanse parse deduplicate labeler and verifier",
    unit: "Compute Units",
    metric: "Per Hour",
    levels: [{ min: 0, max: Infinity, ipu: 0.45 }]
  },
  {
    name: "Advanced Data Quality with Advanced Serverless",
    description: "Runs on Informatica managed serverless Org for Advanced Data Quality and Advanced Data Profiling jobs",
    unit: "Compute Units",
    metric: "Per Hour",
    levels: [{ min: 0, max: Infinity, ipu: 0.77 }]
  },
  {
    name: "API Center",
    description: "Manages and runs APIs for enterprise services and processes with capabilities to design deploy manage and control API usage. Includes API Gateway for routing API calls",
    unit: "API Calls",
    metric: "Per Million API",
    levels: [{ min: 0, max: Infinity, ipu: 13.33 }]
  },
  {
    name: "API Management",
    description: "Manages and validates API calls while routing to target endpoints. Supports both CAI processes and custom APIs with monitoring capabilities",
    unit: "API Calls",
    metric: "Per Million API",
    levels: [{ min: 0, max: Infinity, ipu: 13.33 }]
  },
  {
    name: "Application Ingestion and Replication",
    description: "Enables capture and ingestion of data from on-premises and SaaS application sources in both batch and real-time patterns delivery to cloud data warehouses and lakes",
    unit: "Data Volume",
    metric: "Per Gigabyte",
    levels: [
      { min: 0, max: 2048, ipu: 0.1 },
      { min: 2048, max: 10240, ipu: 0.08 },
      { min: 10240, max: 25600, ipu: 0.05 },
      { min: 25600, max: Infinity, ipu: 0.018 }
    ]
  },
   {
    name: "Application Ingestion and Replication - CDC",
    description: "Specifically focuses on capturing and ingesting change data from applications in real-time with delivery to cloud targets",
    unit: "Data Volume",
    metric: "Per Million Rows",
    levels: [
      { min: 0, max: 10, ipu: 6.00 },
      { min: 10, max: Infinity, ipu: 0.2 }
    ]
  },
  {
    name: "Application Integration",
    description: "Enables creation of processes to integrate systems using synchronous and asynchronous integration orchestrate services expose APIs and create interactive guides. Runs on Customer-managed Secure Agent",
    unit: "Compute Units",
    metric: "Per Hour",
    levels: [
      { min: 0, max: 60, ipu: 1.38 },
      { min: 60, max: 1200, ipu: 0.17 },
      { min: 1200, max: Infinity, ipu: 0.043 }
    ]
  },
]

export default function Component() {
  const [values, setValues] = useState<{ [key: string]: number }>({})
  const [ipuConsumptions, setIpuConsumptions] = useState<{ [key: string]: number }>({})
  const [totalIPU, setTotalIPU] = useState<number>(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("name")

  const handleInputChange = (index: number, value: string) => {
    setValues((prev) => ({ ...prev, [index]: parseFloat(value) || 0 }))
  }

  const filteredAndSortedServices = useMemo(() => {
    return services
      .filter(service => service.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === "name") {
          return a.name.localeCompare(b.name)
        } else if (sortBy === "ipu") {
          const aIPU = a.levels[0].ipu
          const bIPU = b.levels[0].ipu
          return bIPU - aIPU
        }
        return 0
      })
  }, [searchTerm, sortBy])

  const calculateIPU = (service: typeof services[0], value: number) => {
    let totalIPU = 0
    let remainingValue = value

    for (const level of service.levels) {
      if (remainingValue <= 0) break

      const levelMin = level.min
      const levelMax = level.max === Infinity ? remainingValue : level.max
      const levelRange = Math.min(remainingValue, levelMax - levelMin)

      totalIPU += levelRange * level.ipu
      remainingValue -= levelRange
    }

    return totalIPU
  }

  useEffect(() => {
    let total = 0
    const newIpuConsumptions: { [key: string]: number } = {}

    services.forEach((service, index) => {
      const value = values[index] || 0
      const ipu = calculateIPU(service, value)

      newIpuConsumptions[index] = ipu
      total += ipu
    })

    setIpuConsumptions(newIpuConsumptions)
    setTotalIPU(total)
  }, [values])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">IPU Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="ipu">Sort by IPU (High to Low)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <TooltipProvider>
          <ScrollArea className="h-[400px] pr-4 mb-6">
            <div className="space-y-6">
              {filteredAndSortedServices.map((service, index) => (
                <Card key={index} className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      {service.name}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-2 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="font-semibold">{service.name}</p>
                          <p>{service.description}</p>
                          <p className="mt-2">
                            <span className="font-semibold">Unit:</span> {service.unit}
                          </p>
                          <p>
                            <span className="font-semibold">Metric:</span> {service.metric}
                          </p>
                          <p className="mt-2 font-semibold">IPU Levels:</p>
                          <ul className="list-disc list-inside">
                            {service.levels.map((level, i) => (
                              <li key={i}>
                                {level.min} - {level.max === Infinity ? '∞' : level.max}: {level.ipu} IPU
                              </li>
                            ))}
                          </ul>
                        </TooltipContent>
                      </Tooltip>
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor={`service-${index}`} className="text-sm text-muted-foreground">
                        Enter {service.unit} ({service.metric}):
                      </Label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-grow flex items-center">
                          <Input
                            type="number"
                            id={`service-${index}`}
                            min="0"
                            step="0.001"
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            className="flex-grow"
                          />
                          <span className="ml-2 text-sm text-muted-foreground">
                            {service.unit === "Compute Units" ? "hrs" : 
                             service.unit === "API Calls" ? "M" : 
                             service.unit === "Data Volume" ? "GB" : 
                             service.unit === "Rows" ? "M" : 
                             service.unit === "Events Processed" ? "K" : 
                             service.unit === "Queries" ? "K" : 
                             service.unit === "Org" ? "" : 
                             service.unit === "Daily Assets Stored" ? (service.metric.includes("100K") ? "100K" : "K") : 
                             service.unit === "Connection Definitions" ? "" : 
                             ""}
                          </span>
                        </div>
                        <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                          IPU: {ipuConsumptions[index]?.toFixed(3) || '0.000'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TooltipProvider>
        <div className="mt-6 text-center bg-primary text-primary-foreground p-4 rounded-lg">
          <p className="text-xl font-bold">Total IPU Consumption: {totalIPU.toFixed(3)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
