const materialTypeOptions = {
  tile: [
    { value: 'ceramic', label: 'Ceramic Tile' },
    { value: 'porcelain', label: 'Porcelain Tile' },
    { value: 'stone', label: 'Natural Stone' }
  ],
  pipe: [
    { value: 'pvc', label: 'PVC Pipe' },
    { value: 'pex', label: 'PEX Pipe' },
    { value: 'copper', label: 'Copper Pipe' }
  ],
  wire: [
    { value: 'thhn', label: 'THHN Wire' },
    { value: 'armored', label: 'Armored Cable' },
    { value: 'romex', label: 'Romex / NM Cable' }
  ],
  paint: [
    { value: 'standard', label: 'Standard Interior Paint' },
    { value: 'washable', label: 'Washable Finish' },
    { value: 'weatherproof', label: 'Weatherproof Exterior Paint' }
  ],
  concrete: [
    { value: 'ready-mix', label: 'Ready-Mix Bag' },
    { value: 'high-strength', label: 'High Strength Mix' },
    { value: 'rapid-set', label: 'Rapid Set Mix' }
  ]
}

const services = {
  tiling: {
    id: 'tiling',
    title: 'Tiling',
    unit: 'sqft',
    laborRate: 8,
    laborHoursPerUnit: 0.2,
    defaultWaste: 10,
    fields: [
      { key: 'length', label: 'Room Length (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'width', label: 'Room Width (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'materialType', label: 'Tile Type', component: 'select', options: materialTypeOptions.tile },
      { key: 'tileCoverage', label: 'Coverage Per Box (sqft)', type: 'number', min: 0, step: 'any' },
      { key: 'tileBoxPrice', label: 'Tile Box Price', type: 'number', min: 0, step: 'any' },
      { key: 'adhesiveCoverage', label: 'Coverage Per Adhesive Bag (sqft)', type: 'number', min: 0, step: 'any' },
      { key: 'adhesiveBagPrice', label: 'Adhesive Bag Price', type: 'number', min: 0, step: 'any' },
      { key: 'groutCoverage', label: 'Coverage Per Grout Bag (sqft)', type: 'number', min: 0, step: 'any' },
      { key: 'groutBagPrice', label: 'Grout Bag Price', type: 'number', min: 0, step: 'any' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ],
    initialValues: {
      materialType: 'ceramic'
    }
  },
  plumbing: {
    id: 'plumbing',
    title: 'Plumbing',
    unit: 'points',
    laborRate: 55,
    laborHoursPerUnit: 1.4,
    defaultWaste: 7,
    fields: [
      { key: 'fixtures', label: 'Fixtures / Points', type: 'number', min: 0, step: '1' },
      { key: 'pipeLength', label: 'Pipe Length (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'materialType', label: 'Pipe Type', component: 'select', options: materialTypeOptions.pipe },
      { key: 'pipeCostPerFt', label: 'Pipe Cost Per Ft', type: 'number', min: 0, step: 'any' },
      { key: 'fittingUnitCost', label: 'Average Fitting Cost', type: 'number', min: 0, step: 'any' },
      { key: 'fittingsPerFixture', label: 'Fittings Per Fixture', type: 'number', min: 0, step: '1' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ],
    initialValues: {
      materialType: 'pvc',
      fittingsPerFixture: 3
    }
  },
  electrical: {
    id: 'electrical',
    title: 'Electrical',
    unit: 'points',
    laborRate: 45,
    laborHoursPerUnit: 1.1,
    defaultWaste: 5,
    fields: [
      { key: 'points', label: 'Electrical Points', type: 'number', min: 0, step: '1' },
      { key: 'wireLength', label: 'Wire Length (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'materialType', label: 'Wiring Type', component: 'select', options: materialTypeOptions.wire },
      { key: 'wireCostPerFt', label: 'Wire Cost Per Ft', type: 'number', min: 0, step: 'any' },
      { key: 'accessoriesCost', label: 'Accessories Cost', type: 'number', min: 0, step: 'any' },
      { key: 'breakerAllowance', label: 'Breaker / Panel Allowance', type: 'number', min: 0, step: 'any' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ],
    initialValues: {
      materialType: 'thhn'
    }
  },
  painting: {
    id: 'painting',
    title: 'Painting',
    unit: 'sqft',
    laborRate: 4.5,
    laborHoursPerUnit: 0.08,
    defaultWaste: 8,
    fields: [
      { key: 'length', label: 'Room Length (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'width', label: 'Room Width (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'height', label: 'Wall Height (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'coats', label: 'Number of Coats', type: 'number', min: 1, step: '1' },
      { key: 'materialType', label: 'Paint Type', component: 'select', options: materialTypeOptions.paint },
      { key: 'paintCoverage', label: 'Coverage Per Gallon (sqft)', type: 'number', min: 0, step: 'any' },
      { key: 'paintUnitPrice', label: 'Paint Price Per Gallon', type: 'number', min: 0, step: 'any' },
      { key: 'primerCoverage', label: 'Primer Coverage Per Gallon', type: 'number', min: 0, step: 'any' },
      { key: 'primerUnitPrice', label: 'Primer Price Per Gallon', type: 'number', min: 0, step: 'any' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ],
    initialValues: {
      materialType: 'standard',
      coats: 2
    }
  },
  concrete: {
    id: 'concrete',
    title: 'Concrete',
    unit: 'cuft',
    laborRate: 16,
    laborHoursPerUnit: 0.35,
    defaultWaste: 8,
    fields: [
      { key: 'length', label: 'Length (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'width', label: 'Width (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'depth', label: 'Depth (in)', type: 'number', min: 0, step: 'any' },
      { key: 'materialType', label: 'Mix Type', component: 'select', options: materialTypeOptions.concrete },
      { key: 'yieldPerBag', label: 'Yield Per Bag (cuft)', type: 'number', min: 0, step: 'any' },
      { key: 'bagPrice', label: 'Bag Price', type: 'number', min: 0, step: 'any' },
      { key: 'rebarCost', label: 'Rebar / Mesh Cost', type: 'number', min: 0, step: 'any' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ],
    initialValues: {
      materialType: 'ready-mix'
    }
  }
}

export default services
