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
		  {
		    name: "Application Integration with Advanced Serverless",
		    description: "Supports all Application Integration capabilities plus execution of stateful/long-running processes on Informatica-managed serverless Org",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [
		      { min: 0, max: 60, ipu: 2.38 },
		      { min: 60, max: 1200, ipu: 0.30 },
		      { min: 1200, max: 20000, ipu: 0.074 },
		      { min: 20000, max: 50000, ipu: 0.067 },
		      { min: 50000, max: 100000, ipu: 0.053 },
		      { min: 100000, max: Infinity, ipu: 0.021 }
		    ]
		  },
		  {
		    name: "B2B Gateway",
		    description: "Supports exchange of EDI messages with partner management EDI mappings B2B Gateway Connectors monitoring and tracking capabilities",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [
		      { min: 0, max: 1000, ipu: 0.28 },
		      { min: 1000, max: 6000, ipu: 0.04 },
		      { min: 6000, max: Infinity, ipu: 0.005 }
		    ]
		  },
		  {
		    name: "CLAIRE GPT",
		    description: "Automated natural language feature for querying data assets exploring metadata creating ELT pipelines and asking IDMC product help questions. Requires Data Governance and Catalog",
		    unit: "Queries",
		    metric: "Per Thousand Queries",
		    levels: [{ min: 0, max: Infinity, ipu: 50 }]
		  },
		  {
		    name: "Customer Managed Key",
		    description: "Enables use of customer's own master encryption key managed by eligible ecosystem key vault stores configured by individual Org",
		    unit: "Org",
		    metric: "Per 10 IPUs",
		    levels: [{ min: 0, max: Infinity, ipu: 2 }]
		  },
		  {
		    name: "Data Governance and Catalog - Catalog",
		    description: "Stores technical metadata about data repositories including systems and data file stores generated through scanning and system processing",
		    unit: "Daily Assets Stored",
		    metric: "Per 100K Assets",
		    levels: [
		      { min: 0, max: 500, ipu: 0.83 },
		      { min: 500, max: Infinity, ipu: 0.067 }
		    ]
		  },
		  {
		    name: "Data Governance and Catalog - Governance",
		    description: "Captures and stores data governance program assets including glossary business terminology policies and custom asset types",
		    unit: "Daily Assets Stored",
		    metric: "Per Thousand Assets",
		    levels: [{ min: 0, max: Infinity, ipu: 0.95 }]
		  },
		  {
		    name: "Data Governance and Catalog - Metadata Record Consumption",
		    description: "Enables automation of Data Governance and Catalog assets access authoring and maintenance using third-party or custom applications",
		    unit: "API Calls",
		    metric: "Per Thousand API Calls",
		    levels: [
		      { min: 0, max: 100, ipu: 0 },
		      { min: 100, max: Infinity, ipu: 0.32 }
		    ]
		  },
		  {
		    name: "Data Governance and Catalog - Scanner",
		    description: "Enables scanning of data repositories to extract and process metadata for profiling discovery and classification purposes",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [{ min: 0, max: Infinity, ipu: 0.32 }]
		  },
		  {
		    name: "Data Governance and Catalog - Scanner with Advanced Serverless",
		    description: "Enables Data Governance and Catalog scanning jobs on Informatica-managed serverless Org",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [{ min: 0, max: Infinity, ipu: 0.56 }]
		  },
		  {
		    name: "Data Integration",
		    description: "Provides core data integration capabilities including data synchronization simple orchestrations mapping design and execution and REST workload executions",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [
		      { min: 0, max: 2000, ipu: 0.16 },
		      { min: 2000, max: Infinity, ipu: 0.025 }
		    ]
		  },
		  {
		    name: "Data Integration with Advanced Serverless",
		    description: "Enables Data Integration jobs on Informatica-managed serverless Org",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [
		      { min: 0, max: 2000, ipu: 0.28 },
		      { min: 2000, max: Infinity, ipu: 0.10 }
		    ]
		  },
		  {
		    name: "Data Integration - Change Data Capture",
		    description: "Provides access to specific RDBMS on Linux Unix Windows z/Series and iSeries platforms for change data capture",
		    unit: "Rows Processed",
		    metric: "Per Million Rows",
		    levels: [
		      { min: 0, max: 15, ipu: 4.88 },
		      { min: 15, max: 750, ipu: 0.41 },
		      { min: 750, max: Infinity, ipu: 0.04 }
		    ]
		  },
		  {
		    name: "Data Marketplace",
		    description: "Enables creation and storage of data asset collections promoted via storefront for on-request access with marketplace ordering capabilities",
		    unit: "Daily Assets Stored",
		    metric: "Per Hundred Assets",
		    levels: [{ min: 0, max: Infinity, ipu: 0.416 }]
		  },
		  {
		    name: "Data Masking",
		    description: "Allows masking of existing data as part of mapping execution for data security",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [{ min: 0, max: Infinity, ipu: 0.37 }]
		  },
		  {
		    name: "Data Quality",
		    description: "Provides capabilities to design test and execute data quality tasks using Cloud Mapping Designer and data profiling service including various quality assets",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [
		      { min: 0, max: 2000, ipu: 0.38 },
		      { min: 2000, max: Infinity, ipu: 0.152 }
		    ]
		  },
		  {
		    name: "Data Quality with Advanced Serverless",
		    description: "Enables Data Quality and Data Profiling jobs to run on Informatica-managed serverless Org",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [{ min: 0, max: Infinity, ipu: 0.65 }]
		  },
		  {
		    name: "Data Validation",
		    description: "Enables verification of accuracy and completeness of replicated data by comparing target tables against source tables",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [
		      { min: 0, max: 2000, ipu: 0.16 },
		      { min: 2000, max: Infinity, ipu: 0.025 }
		    ]
		  },
		  {
		    name: "Database Ingestion and Replication",
		    description: "Enables capture and ingestion of data from relational databases in batch and real-time patterns with delivery to cloud targets",
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
		    name: "Database Ingestion and Replication - CDC",
		    description: "Focuses on capturing and ingesting CDC data from relational databases in real-time with delivery to cloud targets",
		    unit: "Rows",
		    metric: "Per Million Rows",
		    levels: [
		      { min: 0, max: 15, ipu: 6.5 },
		      { min: 15, max: 750, ipu: 0.55 },
		      { min: 750, max: Infinity, ipu: 0.05 }
		    ]
		  },
		  {
		    name: "File Ingestion and Replication",
		    description: "Enables transfer of files from Data Stores to support large data ingestion and cloud data lake initiatives",
		    unit: "Data Volume",
		    metric: "Per Gigabyte",
		    levels: [
		      { min: 0, max: 5120, ipu: 0.03 },
		      { min: 5120, max: Infinity, ipu: 0.015 }
		    ]
		  },
		  {
		    name: "INFACore",
		    description: "Allows embedding of Data Integration and Data Quality capabilities into external processes with IDE integration",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [{ min: 0, max: Infinity, ipu: 0.15 }]
		  },
		  {
		    name: "Industry Solutions",
		    description: "Enables exchange of industry-specific messages (Healthcare Finance Retail Insurance) through data services with parsing serialization and validation capabilities",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [
		      { min: 0, max: 1000, ipu: 0.28 },
		      { min: 1000, max: 6000, ipu: 0.04 },
		      { min: 6000, max: Infinity, ipu: 0.005 }
		    ]
		  },
		  {
		    name: "Integration Hub",
		    description: "Enables application integration using publish and subscribe patterns with hub management publication repository and monitoring capabilities",
		    unit: "Events Processed",
		    metric: "Per Thousand Events",
		    levels: [
		      { min: 0, max: 10, ipu: 6.00 },
		      { min: 10, max: 100, ipu: 0.50 },
		      { min: 100, max: Infinity, ipu: 0.02 }
		    ]
		  },
		  {
		    name: "Model Serve",
		    description: "Provides capabilities to deploy and operationalize AI/ML models at scale with wizard-driven approach supporting any AI/ML framework in serverless mode",
		    unit: "Compute Units",
		    metric: "Per Hour",
		    levels: [{ min: 0, max: Infinity, ipu: 0.075 }]
		  },
		  {
		    name: "SQL ELT",
		    description: "Enables direct processing of jobs on supported ecosystem targets using SQL-based transformations",
		    unit: "Rows Processed",
		    metric: "Per Million Rows",
		    levels: [
		      { min: 0, max: 100, ipu: 0.048 },
		      { min: 100, max: 10000, ipu: 0.010 },
		      { min: 10000, max: Infinity, ipu: 0.002 }
		    ]
		  },
		  {
		    name: "Secrets Manager Configuration Service",
		    description: "Enables integration with third-party secrets managers for credential storage retrieval and central management",
		    unit: "Connection Definitions",
		    metric: "Daily Connection Definitions",
		    levels: [
		      { min: 0, max: 600, ipu: 0.016 },
		      { min: 600, max: 3000, ipu: 0.0011 },
		      { min: 3000, max: Infinity, ipu: 0.0006 }
		    ]
		  },
		  {
		    name: "Streaming Ingestion and Replication",
		    description: "Enables real-time ingestion of data from streaming and IoT sources with delivery to cloud messaging hub or data lake",
		    unit: "Data Volume",
		    metric: "Per Gigabyte",
		    levels: [
		      { min: 0, max: 1024, ipu: 0.27 },
		      { min: 1024, max: Infinity, ipu: 0.135 }
		    ]
		  },
		  {
		    name: "Pre-Release",
		    description: "Provides early access to new features for testing existing implementations in Non-production mode",
		    unit: "Org",
		    metric: "Per Instance",
		    levels: [{ min: 0, max: Infinity, ipu: 6.00 }]
		  },
		  {
		    name: "Sandbox",
		    description: "Non-production environment for testing and development restricted to support one Production Org",
		    unit: "Org",
		    metric: "Per Instance",
		    levels: [{ min: 0, max: Infinity, ipu: 6.00 }]
		  },
		  {
		    name: "Sub-Org",
		    description: "Hierarchical organization structure with one parent Organization and one or more Sub-organizations",
		    unit: "Org",
		    metric: "Per Instance",
		    levels: [{ min: 0, max: Infinity, ipu: 6.00 }]
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
      const levelMax = level.max
      const levelRange = levelMax - levelMin

      if (levelMax === Infinity) {
        // For the last tier, apply the rate to all remaining value
        totalIPU += remainingValue * level.ipu
        break
      } else if (remainingValue > levelRange) {
        // If the remaining value exceeds this tier, use the full tier
        totalIPU += levelRange * level.ipu
        remainingValue -= levelRange
      } else {
        // If the remaining value is within this tier, calculate and break
        totalIPU += remainingValue * level.ipu
        break
      }
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
