const quickCalculators = [
  {
    id: 'tile',
    name: 'Tile Coverage',
    summary: 'Estimate tile boxes, grout bags, and a starter material total for one room.',
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
    id: 'paint',
    name: 'Paint Planner',
    summary: 'Work out gallons, primer, and starter paint cost for a quick repaint.',
    fields: [
      { key: 'wallArea', label: 'Paintable Area (sqft)', type: 'number', min: 0, step: 'any' },
      { key: 'coveragePerGallon', label: 'Coverage Per Gallon', type: 'number', min: 0, step: 'any' },
      { key: 'paintPrice', label: 'Paint Price Per Gallon', type: 'number', min: 0, step: 'any' },
      { key: 'primerCoverage', label: 'Primer Coverage Per Gallon', type: 'number', min: 0, step: 'any' },
      { key: 'primerPrice', label: 'Primer Price Per Gallon', type: 'number', min: 0, step: 'any' },
      { key: 'coats', label: 'Paint Coats', type: 'number', min: 1, step: '1' }
    ],
    initialValues: {
      coats: 2
    },
    calculate(values) {
      const wallArea = Number(values.wallArea || 0)
      const coats = Number(values.coats || 1)
      const coveragePerGallon = Number(values.coveragePerGallon || 0)
      const primerCoverage = Number(values.primerCoverage || 0)
      const paintGallons = coveragePerGallon > 0 ? Math.ceil((wallArea * coats) / coveragePerGallon) : 0
      const primerGallons = primerCoverage > 0 ? Math.ceil(wallArea / primerCoverage) : 0
      const paintCost = paintGallons * Number(values.paintPrice || 0)
      const primerCost = primerGallons * Number(values.primerPrice || 0)

      return [
        { label: 'Paint Gallons', value: String(paintGallons) },
        { label: 'Primer Gallons', value: String(primerGallons) },
        { label: 'Paint Cost', value: paintCost, money: true },
        { label: 'Starter Total', value: paintCost + primerCost, money: true }
      ]
    }
  },
  {
    id: 'concrete',
    name: 'Concrete Pour',
    summary: 'Get a quick slab volume, bag count, and rough material budget in minutes.',
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
        { label: 'Pour Volume', value: `${volume.toFixed(2)} cu ft` },
        { label: 'Adjusted Volume', value: `${adjustedVolume.toFixed(2)} cu ft` },
        { label: 'Bag Count', value: String(bagCount) },
        { label: 'Material Total', value: totalCost, money: true }
      ]
    }
  }
]

export default quickCalculators
