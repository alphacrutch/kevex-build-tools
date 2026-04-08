const services = {
  tiling: {
    id: 'tiling',
    title: 'Tiling',
    unit: 'sqft',
    laborRate: 8,
    defaultWaste: 10,
    fields: [
      { key: 'area', label: 'Area (sqft)', type: 'number', min: 0, step: 'any' },
      { key: 'tileCoverage', label: 'Tile Coverage Per Box (sqft)', type: 'number', min: 0, step: 'any' },
      { key: 'tileBoxPrice', label: 'Tile Box Price', type: 'number', min: 0, step: 'any' },
      { key: 'adhesiveCoverage', label: 'Adhesive Coverage Per Bag (sqft)', type: 'number', min: 0, step: 'any' },
      { key: 'adhesiveBagPrice', label: 'Adhesive Bag Price', type: 'number', min: 0, step: 'any' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ]
  },
  plumbing: {
    id: 'plumbing',
    title: 'Plumbing',
    unit: 'points',
    laborRate: 55,
    defaultWaste: 5,
    fields: [
      { key: 'fixtures', label: 'Number of Fixtures', type: 'number', min: 0, step: '1' },
      { key: 'pipeLength', label: 'Pipe Length (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'pipeCostPerFt', label: 'Pipe Cost Per Ft', type: 'number', min: 0, step: 'any' },
      { key: 'fittingsCost', label: 'Fittings Cost', type: 'number', min: 0, step: 'any' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ]
  },
  electrical: {
    id: 'electrical',
    title: 'Electrical',
    unit: 'points',
    laborRate: 45,
    defaultWaste: 5,
    fields: [
      { key: 'points', label: 'Number of Points', type: 'number', min: 0, step: '1' },
      { key: 'wireLength', label: 'Wire Length (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'wireCostPerFt', label: 'Wire Cost Per Ft', type: 'number', min: 0, step: 'any' },
      { key: 'accessoriesCost', label: 'Accessories Cost', type: 'number', min: 0, step: 'any' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ]
  }
}

export default services
