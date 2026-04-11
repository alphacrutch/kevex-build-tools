const quickCalculators = [
  {
    id: 'tile',
    name: 'Tile Coverage',
    summary: 'Estimate tile boxes, grout bags, and material total for a quick room quote.',
    fields: [
      { key: 'roomArea', label: 'Room Area (sqft)', type: 'number', min: 0, step: 'any' },
      { key: 'tileCoverage', label: 'Coverage Per Box (sqft)', type: 'number', min: 0, step: 'any' },
      { key: 'boxPrice', label: 'Price Per Box', type: 'number', min: 0, step: 'any' },
      { key: 'groutCoverage', label: 'Coverage Per Grout Bag (sqft)', type: 'number', min: 0, step: 'any' },
      { key: 'groutPrice', label: 'Price Per Grout Bag', type: 'number', min: 0, step: 'any' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ],
    initialValues: {
      wastePercent: 10
    },
    calculate(values) {
      const roomArea = Number(values.roomArea || 0)
      const wastePercent = Number(values.wastePercent || 0)
      const adjustedArea = roomArea * (1 + wastePercent / 100)
      const tileBoxes = values.tileCoverage > 0 ? Math.ceil(adjustedArea / Number(values.tileCoverage)) : 0
      const groutBags = values.groutCoverage > 0 ? Math.ceil(adjustedArea / Number(values.groutCoverage)) : 0
      const tileCost = tileBoxes * Number(values.boxPrice || 0)
      const groutCost = groutBags * Number(values.groutPrice || 0)

      return [
        { label: 'Adjusted Area', value: `${adjustedArea.toFixed(1)} sqft` },
        { label: 'Tile Boxes', value: String(tileBoxes) },
        { label: 'Grout Bags', value: String(groutBags) },
        { label: 'Material Total', value: tileCost + groutCost, money: true }
      ]
    }
  },
  {
    id: 'pipes',
    name: 'Pipe Run',
    summary: 'Calculate adjusted pipe length, fittings, and a rough plumbing material budget.',
    fields: [
      { key: 'pipeLength', label: 'Pipe Length (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'pipeCost', label: 'Pipe Cost Per Ft', type: 'number', min: 0, step: 'any' },
      { key: 'fittings', label: 'Number of Fittings', type: 'number', min: 0, step: '1' },
      { key: 'fittingCost', label: 'Fitting Cost Each', type: 'number', min: 0, step: 'any' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ],
    initialValues: {
      wastePercent: 7
    },
    calculate(values) {
      const pipeLength = Number(values.pipeLength || 0)
      const adjustedLength = pipeLength * (1 + Number(values.wastePercent || 0) / 100)
      const fittings = Number(values.fittings || 0)
      const pipeCost = adjustedLength * Number(values.pipeCost || 0)
      const fittingsCost = fittings * Number(values.fittingCost || 0)

      return [
        { label: 'Adjusted Length', value: `${adjustedLength.toFixed(1)} ft` },
        { label: 'Fittings', value: String(fittings) },
        { label: 'Pipe Cost', value: pipeCost, money: true },
        { label: 'Material Total', value: pipeCost + fittingsCost, money: true }
      ]
    }
  },
  {
    id: 'wiring',
    name: 'Wiring Planner',
    summary: 'Work out wire length, accessories, and a starter electrical material total.',
    fields: [
      { key: 'wireLength', label: 'Wire Length (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'wireCost', label: 'Wire Cost Per Ft', type: 'number', min: 0, step: 'any' },
      { key: 'accessories', label: 'Accessories Cost', type: 'number', min: 0, step: 'any' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ],
    initialValues: {
      wastePercent: 5
    },
    calculate(values) {
      const wireLength = Number(values.wireLength || 0)
      const adjustedLength = wireLength * (1 + Number(values.wastePercent || 0) / 100)
      const wireCost = adjustedLength * Number(values.wireCost || 0)
      const accessories = Number(values.accessories || 0)

      return [
        { label: 'Adjusted Wire Length', value: `${adjustedLength.toFixed(1)} ft` },
        { label: 'Wire Cost', value: wireCost, money: true },
        { label: 'Accessories', value: accessories, money: true },
        { label: 'Material Total', value: wireCost + accessories, money: true }
      ]
    }
  },
  {
    id: 'concrete',
    name: 'Concrete Bags',
    summary: 'Get slab volume, bag count, and a quick concrete material budget.',
    fields: [
      { key: 'length', label: 'Length (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'width', label: 'Width (ft)', type: 'number', min: 0, step: 'any' },
      { key: 'depth', label: 'Depth (in)', type: 'number', min: 0, step: 'any' },
      { key: 'yieldPerBag', label: 'Yield Per Bag (cu ft)', type: 'number', min: 0, step: 'any' },
      { key: 'bagPrice', label: 'Price Per Bag', type: 'number', min: 0, step: 'any' },
      { key: 'wastePercent', label: 'Waste (%)', type: 'number', min: 0, step: 'any' }
    ],
    initialValues: {
      wastePercent: 8
    },
    calculate(values) {
      const length = Number(values.length || 0)
      const width = Number(values.width || 0)
      const depthFeet = Number(values.depth || 0) / 12
      const wastePercent = Number(values.wastePercent || 0)
      const volume = length * width * depthFeet
      const adjustedVolume = volume * (1 + wastePercent / 100)
      const yieldPerBag = Number(values.yieldPerBag || 0)
      const bagCount = yieldPerBag > 0 ? Math.ceil(adjustedVolume / yieldPerBag) : 0
      const totalCost = bagCount * Number(values.bagPrice || 0)

      return [
        { label: 'Adjusted Volume', value: `${adjustedVolume.toFixed(2)} cu ft` },
        { label: 'Bag Count', value: String(bagCount) },
        { label: 'Material Total', value: totalCost, money: true }
      ]
    }
  }
]

export default quickCalculators
