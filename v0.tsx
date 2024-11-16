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
  // ... (other services remain unchanged)
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

    for (const level of service.levels) {
      if (value <= 0) break

      const levelRange = level.max === Infinity ? value : Math.min(value, level.max - level.min)
      totalIPU += levelRange * level.ipu
      value -= levelRange
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
                        <Input
                          type="number"
                          id={`service-${index}`}
                          min="0"
                          step="0.01"
                          onChange={(e) => handleInputChange(index, e.target.value)}
                          className="flex-grow"
                        />
                        <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                          IPU: {ipuConsumptions[index]?.toFixed(2) || '0.00'}
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
          <p className="text-xl font-bold">Total IPU Consumption: {totalIPU.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  )
}