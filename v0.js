"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Component;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var scroll_area_1 = require("@/components/ui/scroll-area");
var tooltip_1 = require("@/components/ui/tooltip");
var lucide_react_1 = require("lucide-react");
var select_1 = require("@/components/ui/select");
var services = [
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
];
function Component() {
    var _a = (0, react_1.useState)({}), values = _a[0], setValues = _a[1];
    var _b = (0, react_1.useState)({}), ipuConsumptions = _b[0], setIpuConsumptions = _b[1];
    var _c = (0, react_1.useState)(0), totalIPU = _c[0], setTotalIPU = _c[1];
    var _d = (0, react_1.useState)(""), searchTerm = _d[0], setSearchTerm = _d[1];
    var _e = (0, react_1.useState)("name"), sortBy = _e[0], setSortBy = _e[1];
    var handleInputChange = function (index, value) {
        setValues(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[index] = parseFloat(value) || 0, _a)));
        });
    };
    var filteredAndSortedServices = (0, react_1.useMemo)(function () {
        return services
            .filter(function (service) { return service.name.toLowerCase().includes(searchTerm.toLowerCase()); })
            .sort(function (a, b) {
            if (sortBy === "name") {
                return a.name.localeCompare(b.name);
            }
            else if (sortBy === "ipu") {
                var aIPU = a.levels[0].ipu;
                var bIPU = b.levels[0].ipu;
                return bIPU - aIPU;
            }
            return 0;
        });
    }, [searchTerm, sortBy]);
    var calculateIPU = function (service, value) {
        var totalIPU = 0;
        for (var _i = 0, _a = service.levels; _i < _a.length; _i++) {
            var level = _a[_i];
            if (value <= 0)
                break;
            var levelRange = level.max === Infinity ? value : Math.min(value, level.max - level.min);
            totalIPU += levelRange * level.ipu;
            value -= levelRange;
        }
        return totalIPU;
    };
    (0, react_1.useEffect)(function () {
        var total = 0;
        var newIpuConsumptions = {};
        services.forEach(function (service, index) {
            var value = values[index] || 0;
            var ipu = calculateIPU(service, value);
            newIpuConsumptions[index] = ipu;
            total += ipu;
        });
        setIpuConsumptions(newIpuConsumptions);
        setTotalIPU(total);
    }, [values]);
    return (<card_1.Card className="w-full max-w-4xl mx-auto">
      <card_1.CardHeader>
        <card_1.CardTitle className="text-2xl font-bold text-center">IPU Calculator</card_1.CardTitle>
      </card_1.CardHeader>
      <card_1.CardContent>
        <div className="mb-4 flex items-center space-x-2">
          <div className="relative flex-grow">
            <lucide_react_1.Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>
            <input_1.Input className="pl-8" placeholder="Search services..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
          </div>
          <select_1.Select value={sortBy} onValueChange={setSortBy}>
            <select_1.SelectTrigger className="w-[180px]">
              <select_1.SelectValue placeholder="Sort by"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              <select_1.SelectItem value="name">Sort by Name</select_1.SelectItem>
              <select_1.SelectItem value="ipu">Sort by IPU (High to Low)</select_1.SelectItem>
            </select_1.SelectContent>
          </select_1.Select>
        </div>
        <tooltip_1.TooltipProvider>
          <scroll_area_1.ScrollArea className="h-[400px] pr-4 mb-6">
            <div className="space-y-6">
              {filteredAndSortedServices.map(function (service, index) {
            var _a;
            return (<card_1.Card key={index} className="overflow-hidden transition-shadow hover:shadow-md">
                  <card_1.CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      {service.name}
                      <tooltip_1.Tooltip>
                        <tooltip_1.TooltipTrigger asChild>
                          <lucide_react_1.Info className="w-4 h-4 ml-2 text-muted-foreground cursor-help"/>
                        </tooltip_1.TooltipTrigger>
                        <tooltip_1.TooltipContent className="max-w-sm">
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
                            {service.levels.map(function (level, i) { return (<li key={i}>
                                {level.min} - {level.max === Infinity ? '∞' : level.max}: {level.ipu} IPU
                              </li>); })}
                          </ul>
                        </tooltip_1.TooltipContent>
                      </tooltip_1.Tooltip>
                    </h3>
                    <div className="space-y-2">
                      <label_1.Label htmlFor={"service-".concat(index)} className="text-sm text-muted-foreground">
                        Enter {service.unit} ({service.metric}):
                      </label_1.Label>
                      <div className="flex items-center space-x-2">
                        <input_1.Input type="number" id={"service-".concat(index)} min="0" step="0.01" onChange={function (e) { return handleInputChange(index, e.target.value); }} className="flex-grow"/>
                        <span className="text-sm font-medium bg-muted px-2 py-1 rounded">
                          IPU: {((_a = ipuConsumptions[index]) === null || _a === void 0 ? void 0 : _a.toFixed(2)) || '0.00'}
                        </span>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>);
        })}
            </div>
          </scroll_area_1.ScrollArea>
        </tooltip_1.TooltipProvider>
        <div className="mt-6 text-center bg-primary text-primary-foreground p-4 rounded-lg">
          <p className="text-xl font-bold">Total IPU Consumption: {totalIPU.toFixed(2)}</p>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
